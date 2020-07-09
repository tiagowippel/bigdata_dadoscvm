'use strict';

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { Bar, Line } from 'react-chartjs-2';

import {
    BrowserRouter as Router,
    //HashRouter as Router,
    //Router,
    Route,
    Link,
    Redirect,
    Switch,
    withRouter,
} from 'react-router-dom';

const Test = (props) => {
    return <h1>Teste</h1>;
};

import {
    observer,
    //Provider
} from 'mobx-react';

import {
    //action,
    //observable,
    toJS,
    extendObservable,
    observable,
} from 'mobx';

import HeatMap from 'react-heatmap-grid';

import {
    Layout,
    Menu,
    Card,
    Statistic,
    Select,
    Row,
    Col,
    Radio,
    Divider,
    Button,
    Modal,
} from 'antd';
const { Header, Content, Footer, Sider } = Layout;

import ApolloClient, { gql } from 'apollo-boost';

import _ from 'lodash';

const client = new ApolloClient({
    //uri: 'http://dashboard-financeiro.herokuapp.com/v1/graphql',
    uri: 'http://45.162.68.46:8080/v1/graphql',
    request: (operation) => {
        //const token = localStorage.getItem('token')
        operation.setContext({
            headers: {
                //authorization: token ? `Bearer ${token}` : ''
                'x-hasura-admin-secret': 'bigdata123',
            },
        });
    },
});

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        return (
            <Router>
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            //defaultOpenKeys={['sub1']}
                            style={{
                                height: '100%',
                                //borderRight1: 0
                            }}
                        >
                            <Menu.Item key="1">
                                <Link to="/porEmpresa">Por Empresa</Link>
                            </Menu.Item>
                            {/* <Menu.Item key="2">
                                <Link to="/porSetor">Por Setor</Link>
                            </Menu.Item> */}
                        </Menu>
                    </Sider>
                    <Layout
                        style={
                            {
                                //border: '1px red solid',
                                //height: '100vh',
                                //display: 'flex',
                            }
                        }
                    >
                        <Layout.Content
                            style={{
                                //border: '1px green solid',
                                //flex: 1,
                                overflow: 'auto',
                                padding: '10px',
                            }}
                        >
                            <Switch>
                                <Route
                                    path="/"
                                    exact
                                    component={() => (
                                        <Redirect to="/porEmpresa" />
                                    )}
                                    // component={(props) => (
                                    //     <Card
                                    //         style={{
                                    //             maxWidth: '500px',
                                    //             margin: '10px auto',
                                    //         }}
                                    //     >
                                    //         <h1>Home</h1>
                                    //     </Card>
                                    // )}
                                />
                                <Route
                                    path="/404"
                                    component={(props) => <h1>404</h1>}
                                />
                                <Route
                                    path="/porEmpresa"
                                    component={PorEmpresa1}
                                />
                                {/* <Route path="/porSetor" component={PorSetor} /> */}
                                <Route
                                    component={() => <Redirect to="/404" />}
                                />
                            </Switch>
                        </Layout.Content>
                    </Layout>
                    {/* <Footer>footer</Footer> */}
                </Layout>
            </Router>
        );
    }
}

export default App;

@observer
class PorEmpresa1 extends React.Component {
    constructor(props) {
        super(props);
    }

    @observable loadingEmpresa = false;
    @observable empresa = null;
    @observable empresas = [];

    @observable trimestre = 1;
    @observable dados = {};

    @observable tickers = [];
    @observable ticker = null;
    @observable dadosTicker = [];

    buscaEmpresas = _.debounce((filter) => {
        this.loadingEmpresa = true;
        client
            .query({
                query: gql`
                        {
                            empresa(
                                where: {
                                    #_or: {
                                        #nome_fantasia: {
                                        #    _ilike: "%${filter}%"
                                        #},
                                        razao_social: {
                                            _ilike: "%${filter}%"
                                        }
                                    #},
                                },
                                limit: 10,
                            ) {
                                id
                                cnpj
                                nome_fantasia
                                razao_social
                            }
                        }
                    `,
            })
            .then((result) => {
                this.empresas = result.data.empresa;
            })
            .finally((e) => {
                this.loadingEmpresa = false;
            });
    }, 300);

    componentDidMount() {
        client
            .query({
                query: gql`
                    {
                        taxas_trimestre(where: { ano: { _gte: "2018" } }) {
                            dolar
                            igpm
                            selic
                            trimestre
                            ano
                        }
                    }
                `,
            })
            .then((result) => {
                console.log(result.data.taxas_trimestre);
            });
    }

    render() {
        const dados = toJS(this.dados);

        const b = [].concat(
            _.values(dados[2018]),
            _.values(dados[2019]),
            _.values(dados[2020])
        );

        return (
            <div>
                <Card>
                    <Row gutter={[5, 5]}>
                        <Col span={10}>
                            <Select
                                //defaultValue="weg"
                                style={{ width: '100%' }}
                                showSearch
                                allowClear
                                showArrow={false}
                                value={this.empresa}
                                loading={this.loadingEmpresa}
                                filterOption={false}
                                onChange={(value) => {
                                    this.empresa = value;
                                }}
                                onSearch={(filter) => {
                                    this.buscaEmpresas(filter);
                                }}
                            >
                                {toJS(this.empresas).map((item, k) => {
                                    return (
                                        <Select.Option
                                            key={k}
                                            value={item.cnpj}
                                        >
                                            {`${item.razao_social}-${item.nome_fantasia}`}
                                        </Select.Option>
                                    );
                                })}
                                {/* <Select.Option value="weg">WEG S.A.</Select.Option> */}
                            </Select>
                        </Col>
                        <Col span={4}>
                            <Button
                                type="primary"
                                onClick={(e) => {
                                    client
                                        .query({
                                            query: gql`
                                            query MyQuery {
                                                faturamento(
                                                    where: {
                                                        _and: {
                                                            cnpj_empresa: {
                                                                _eq:"${this.empresa}"
                                                            },
                                                            ano: {_gte: 2018}
                                                        }
                                                    }
                                                ) {
                                                    trimestre
                                                    ano
                                                    vl_faturamento
                                                    vl_lucro_liquido
                                                }
                                                empresa_acao(where: {cnpj_empresa: {
                                                    _eq:"${this.empresa}"
                                                }}) {
                                                    ticker
                                                }
                                            }
                                        `,
                                        })
                                        .then((result) => {
                                            this.tickers = result.data.empresa_acao.map(
                                                (item) => item.ticker
                                            );

                                            const dados = result.data.faturamento.reduce(
                                                (obj, item) => {
                                                    !obj[item.ano] &&
                                                        (obj[item.ano] = {});
                                                    !obj[item.ano][
                                                        item.trimestre
                                                    ] &&
                                                        (obj[item.ano][
                                                            item.trimestre
                                                        ] = null);

                                                    obj[item.ano][
                                                        item.trimestre
                                                    ] = item;

                                                    return obj;
                                                },
                                                {}
                                            );

                                            this.dados = dados;
                                            this.trimestre = 1;
                                        })
                                        .finally((e) => {});
                                }}
                            >
                                Atualizar
                            </Button>
                        </Col>
                    </Row>
                </Card>
                <Divider />
                <Card title="Faturamentos Trimestrais">
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Radio.Group
                                //defaultValue="1"
                                size="large"
                                onChange={(e) => {
                                    //console.log(e);
                                    this.trimestre = e.target.value;
                                }}
                                value={this.trimestre}
                            >
                                <Radio.Button value="1">
                                    1º Trimestre
                                </Radio.Button>
                                <Radio.Button value="2">
                                    2º Trimestre
                                </Radio.Button>
                                <Radio.Button value="3">
                                    3º Trimestre
                                </Radio.Button>
                                <Radio.Button value="4">
                                    4º Trimestre
                                </Radio.Button>
                            </Radio.Group>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={6}>
                            <Card>
                                <Statistic
                                    title="2018"
                                    value={
                                        this.dados[2018]?.[this.trimestre]
                                            ?.vl_faturamento
                                    }
                                    precision={2}
                                    prefix="R$"
                                    decimalSeparator=","
                                    groupSeparator="."
                                    valueStyle={{
                                        color: 'green',
                                    }}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic
                                    title="2019"
                                    value={
                                        this.dados[2019]?.[this.trimestre]
                                            ?.vl_faturamento
                                    }
                                    precision={2}
                                    prefix="R$"
                                    decimalSeparator=","
                                    groupSeparator="."
                                    valueStyle={{
                                        color: 'green',
                                    }}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic
                                    title="2020"
                                    value={
                                        this.dados[2020]?.[this.trimestre]
                                            ?.vl_faturamento
                                    }
                                    precision={2}
                                    prefix="R$"
                                    decimalSeparator=","
                                    groupSeparator="."
                                    valueStyle={{
                                        color: 'green',
                                    }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Card>
                <Divider />
                <Card title="Evolução Faturamentos">
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Line
                                options={{
                                    scales: {
                                        yAxes: [
                                            {
                                                ticks: {
                                                    beginAtZero: true,
                                                },
                                            },
                                        ],
                                    },
                                }}
                                data={{
                                    labels: [
                                        '1º Trimestre 2018',
                                        '2º Trimestre 2018',
                                        '3º Trimestre 2018',
                                        '4º Trimestre 2018',
                                        '1º Trimestre 2019',
                                        '2º Trimestre 2019',
                                        '3º Trimestre 2019',
                                        '4º Trimestre 2019',
                                        '1º Trimestre 2020',
                                        '2º Trimestre 2020',
                                        '3º Trimestre 2020',
                                        '4º Trimestre 2020',
                                    ],
                                    datasets: [
                                        {
                                            label: 'Faturamento',
                                            fill: false,
                                            data: b.map(
                                                (item) => item.vl_faturamento
                                            ),
                                            borderColor: 'blue',
                                        },
                                        {
                                            label: 'Lucro',
                                            fill: false,
                                            data: b.map(
                                                (item) => item.vl_lucro_liquido
                                            ),
                                            borderColor: 'green',
                                        },
                                    ],
                                }}
                                //   width={100}
                                height={80}
                                //   options={{ maintainAspectRatio: false }}
                            />
                        </Col>
                    </Row>
                </Card>
                <Divider />
                <Card title="Evolução Faturamentos Anos">
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Line
                                options={{
                                    scales: {
                                        yAxes: [
                                            {
                                                ticks: {
                                                    beginAtZero: true,
                                                },
                                            },
                                        ],
                                    },
                                }}
                                data={{
                                    labels: [
                                        '1º Trimestre',
                                        '2º Trimestre',
                                        '3º Trimestre',
                                        '4º Trimestre',
                                    ],
                                    datasets: [
                                        {
                                            label: 'Faturamento 2018',
                                            fill: false,
                                            data: _.values(
                                                this.dados[2018]
                                            ).map(
                                                (item) => item.vl_faturamento
                                            ),
                                            borderColor: 'blue',
                                        },
                                        {
                                            label: 'Faturamento 2019',
                                            fill: false,
                                            data: _.values(
                                                this.dados[2019]
                                            ).map(
                                                (item) => item.vl_faturamento
                                            ),
                                            borderColor: 'green',
                                        },
                                        {
                                            label: 'Faturamento 2020',
                                            fill: false,
                                            data: _.values(
                                                this.dados[2020]
                                            ).map(
                                                (item) => item.vl_faturamento
                                            ),
                                            borderColor: 'red',
                                        },
                                    ],
                                }}
                                //   width={100}
                                //height={80}
                                //   options={{ maintainAspectRatio: false }}
                            />
                        </Col>
                        <Col span={12}>
                            <Bar
                                options={{}}
                                data={{
                                    labels: [
                                        '1º Trimestre',
                                        '2º Trimestre',
                                        '3º Trimestre',
                                        '4º Trimestre',
                                    ],
                                    datasets: [
                                        {
                                            label: 'Faturamento 2018',
                                            fill: false,
                                            data: _.values(
                                                this.dados[2018]
                                            ).map(
                                                (item) => item.vl_faturamento
                                            ),
                                            backgroundColor: 'blue',
                                        },
                                        {
                                            label: 'Faturamento 2019',
                                            fill: false,
                                            data: _.values(
                                                this.dados[2019]
                                            ).map(
                                                (item) => item.vl_faturamento
                                            ),
                                            backgroundColor: 'green',
                                        },
                                        {
                                            label: 'Faturamento 2020',
                                            fill: false,
                                            data: _.values(
                                                this.dados[2020]
                                            ).map(
                                                (item) => item.vl_faturamento
                                            ),
                                            backgroundColor: 'red',
                                        },
                                    ],
                                }}
                                //   width={100}
                                //height={80}
                                //   options={{ maintainAspectRatio: false }}
                            />
                        </Col>
                    </Row>
                </Card>
                <Divider />
                <Card title="Ações">
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Radio.Group
                                defaultValue="1"
                                size="large"
                                onChange={(e) => {
                                    //this.ticker = e.target.value;
                                    client
                                        .query({
                                            query: gql`
                                            query MyQuery {
                                                cotacao(where: {ticker: {_eq: "${e.target.value}"}, ano: {_gte: "2018"}}) {
                                                    trimestre
                                                    variacao
                                                    vl_preco
                                                    tipo_acao
                                                    fator_cotacao
                                                    data_cotacao
                                                    ano
                                                }
                                            }
                                        `,
                                        })
                                        .then((result) => {
                                            this.dadosTicker =
                                                result.data.cotacao;
                                        });
                                }}
                                //value={this.ticker}
                            >
                                {this.tickers.map((item, k) => {
                                    return (
                                        <Radio.Button key={k} value={item}>
                                            {item}
                                        </Radio.Button>
                                    );
                                })}
                            </Radio.Group>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Card>
                                <Line
                                    options={{
                                        scales: {
                                            yAxes: [
                                                {
                                                    ticks: {
                                                        //beginAtZero: true,
                                                        //max: 1,
                                                        //min: -1,
                                                    },
                                                },
                                            ],
                                        },
                                    }}
                                    data={{
                                        labels: [
                                            '1º Trimestre 2018',
                                            '2º Trimestre 2018',
                                            '3º Trimestre 2018',
                                            '4º Trimestre 2018',
                                            '1º Trimestre 2019',
                                            '2º Trimestre 2019',
                                            '3º Trimestre 2019',
                                            '4º Trimestre 2019',
                                            '1º Trimestre 2020',
                                            '2º Trimestre 2020',
                                            '3º Trimestre 2020',
                                            '4º Trimestre 2020',
                                        ],
                                        datasets: [
                                            {
                                                label: 'Variação',
                                                fill: false,
                                                data: this.dadosTicker.map(
                                                    (item) => item.variacao
                                                ),
                                                borderColor: 'blue',
                                            },
                                        ],
                                    }}
                                    //   width={100}
                                    height={80}
                                    //   options={{ maintainAspectRatio: false }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Card>
                <Divider />
                <Card title="Correlações">
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <HeatMap
                                xLabels={['dolar', 'igpm', 'selic']}
                                yLabels={['dolar', 'igpm', 'selic']}
                                data={[
                                    [-1, 1, 1],
                                    [2, 2, 2],
                                    [3, 4, 5],
                                ]}
                                cellRender={(value) =>
                                    value && <div>{value}</div>
                                }
                                squares
                                height={80}
                            />
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
}
