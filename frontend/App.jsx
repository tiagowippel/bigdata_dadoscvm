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
                                <Route path="/porSetor" component={PorSetor} />
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

const PorSetor = (props) => {
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState(null);
    const [loading, setLoading] = useState(false);
    const [optionsUF, setOptionsUF] = useState([]);
    const [valueUF, setValueUF] = useState(null);
    const [loadingUF, setLoadingUF] = useState(false);

    const buscaEstados = _.debounce((filter) => {
        setLoadingUF(true);
        client
            .query({
                query: gql`
                    {
                        estado(
                            where: {
                                #_or: {
                                    #nome_fantasia: {
                                    #    _ilike: "%${filter}%"
                                    #},
                                    nome: {
                                        _ilike: "%${filter}%"
                                    }
                                #},
                            },
                            limit: 10,
                        ) {
                            id
                            nome
                            sigla
                        }
                    }
                `,
            })
            .then((result) => {
                setOptionsUF(result.data.estado);
            })
            .finally((e) => {
                setLoadingUF(false);
            });
    }, 300);

    const buscaSetores = _.debounce((filter) => {
        setLoading(true);
        client
            .query({
                query: gql`
                    {
                        setor(
                            where: {
                                    nome: {
                                        _ilike: "%${filter}%"
                                    }
                            },
                            limit: 10,
                        ) {
                            id
                            nome
                        }
                    }
                `,
            })
            .then((result) => {
                setOptions(result.data.setor);
            })
            .finally((e) => {
                setLoading(false);
            });
    }, 300);

    return (
        <div>
            <Card>
                <Row gutter={[5, 5]}>
                    <Col span={4}>
                        {/* <Select defaultValue="todos" style={{ width: '100%' }}>
                            <Select.Option value="todos">
                                Todos estados
                            </Select.Option>
                            <Select.Option value="sc">SC</Select.Option>
                        </Select> */}
                        <Select
                            //defaultValue="weg"
                            style={{ width: '100%' }}
                            showSearch
                            allowClear
                            showArrow={false}
                            value={valueUF}
                            loading={loadingUF}
                            filterOption={false}
                            onChange={(value) => {
                                //console.log(value);
                                setValueUF(value);
                            }}
                            onSearch={(filter) => {
                                buscaEstados(filter);
                            }}
                            options={optionsUF.map((item, k) => {
                                return {
                                    value: item.id,
                                    label: `${item.nome}-${item.sigla}`,
                                };
                            })}
                        ></Select>
                    </Col>
                    <Col span={12}>
                        <Select
                            //defaultValue="weg"
                            style={{ width: '100%' }}
                            showSearch
                            allowClear
                            showArrow={false}
                            value={value}
                            loading={loading}
                            filterOption={false}
                            onChange={(value) => {
                                //console.log(value);
                                setValue(value);
                            }}
                            onSearch={(filter) => {
                                buscaSetores(filter);
                            }}
                            options={options.map((item, k) => {
                                return {
                                    value: item.id,
                                    label: `${item.nome}`,
                                };
                            })}
                        >
                            {/* {options.map((item, k) => {
                                return (
                                    <Select.Option key={k} value={item.id}>
                                        {`${item.nome}`}
                                    </Select.Option>
                                );
                            })} */}
                            {/* <Select.Option value="weg">WEG S.A.</Select.Option> */}
                        </Select>
                    </Col>
                </Row>
            </Card>
            <Divider />
            <Card title="Faturamentos Trimestrais">
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Radio.Group defaultValue="1" size="large">
                            <Radio.Button value="1">1º Trimestre</Radio.Button>
                            <Radio.Button value="2">2º Trimestre</Radio.Button>
                            <Radio.Button value="3">3º Trimestre</Radio.Button>
                            <Radio.Button value="4">4º Trimestre</Radio.Button>
                        </Radio.Group>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="2018"
                                value={1000.0}
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
                                value={1000.0}
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
                                value={1000.0}
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
                                        label: '2018',
                                        fill: false,
                                        data: [10, 20, 15, 18],
                                        borderColor: 'red',
                                    },
                                    {
                                        label: '2019',
                                        fill: false,
                                        data: [8, 15, 10, 20],
                                        borderColor: 'blue',
                                    },
                                    {
                                        label: '2020',
                                        fill: false,
                                        data: [12, 6],
                                        borderColor: 'green',
                                    },
                                ],
                            }}
                            //   width={100}
                            //   height={50}
                            //   options={{ maintainAspectRatio: false }}
                        />
                    </Col>
                    <Col span={12}>
                        <Bar
                            data={{
                                labels: [
                                    '1º Trimestre',
                                    '2º Trimestre',
                                    '3º Trimestre',
                                    '4º Trimestre',
                                ],
                                datasets: [
                                    {
                                        label: '2018',
                                        fill: false,
                                        data: [10, 20, 15, 18],
                                        backgroundColor: 'red',
                                    },
                                    {
                                        label: '2019',
                                        fill: false,
                                        data: [8, 15, 10, 20],
                                        backgroundColor: 'blue',
                                    },
                                    {
                                        label: '2020',
                                        fill: false,
                                        data: [12, 6],
                                        backgroundColor: 'green',
                                    },
                                ],
                            }}
                            //   width={100}
                            //   height={50}
                            //   options={{ maintainAspectRatio: false }}
                        />
                    </Col>
                </Row>
            </Card>
            <Divider />
            <Card title="Variação Preço Ações">
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Radio.Group defaultValue="on" size="large">
                            <Radio.Button value="on">Ordinárias</Radio.Button>
                            <Radio.Button value="pn">
                                Preferenciais
                            </Radio.Button>
                        </Radio.Group>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Line
                            options={{
                                scales: {
                                    yAxes: [
                                        {
                                            ticks1: {
                                                max: 1,
                                                min: -1,
                                                //beginAtZero: true,
                                            },
                                        },
                                    ],
                                },
                            }}
                            data={{
                                labels: [
                                    '',
                                    '1º Trimestre',
                                    '2º Trimestre',
                                    '3º Trimestre',
                                    '4º Trimestre',
                                ],
                                datasets: [
                                    {
                                        label: '2018',
                                        fill: false,
                                        data: [0, 0.1, 0.15, 0.16, 0.16],
                                        borderColor: 'red',
                                    },
                                    {
                                        label: '2019',
                                        fill: false,
                                        data: [0, 0.1, 0.14, 0.13, 0.14],
                                        borderColor: 'blue',
                                    },
                                    {
                                        label: '2020',
                                        fill: false,
                                        data: [0, -0.05, -0.08, 0.02, 0.04],
                                        borderColor: 'green',
                                    },
                                ],
                            }}
                        />
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

let dados = null;

const PorEmpresa = (props) => {
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState(null);
    const [loading, setLoading] = useState(false);
    const [optionsUF, setOptionsUF] = useState([]);
    const [valueUF, setValueUF] = useState(null);
    const [loadingUF, setLoadingUF] = useState(false);

    const [trimestre, setTrimestre] = useState(0);

    const [fatAno2018, setFatAno2018] = useState(0);
    const [fatAno2019, setFatAno2019] = useState(0);
    const [fatAno2020, setFatAno2020] = useState(0);

    const [fatAnual2018, setFatAnual2018] = useState([]);
    const [fatAnual2019, setFatAnual2019] = useState([]);
    const [fatAnual2020, setFatAnual2020] = useState([]);

    useEffect(() => {
        if (dados) {
            setFatAno2018(dados[`2018${trimestre}`]?.vl_faturamento);
            setFatAno2019(dados[`2019${trimestre}`]?.vl_faturamento);
            setFatAno2020(dados[`2020${trimestre}`]?.vl_faturamento);
        }
    }, [trimestre]);

    const buscaEmpresas = _.debounce((filter) => {
        setLoading(true);
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
                setOptions(result.data.empresa);
            })
            .finally((e) => {
                setLoading(false);
            });
    }, 300);

    const buscaEstados = _.debounce((filter) => {
        setLoadingUF(true);
        client
            .query({
                query: gql`
                    {
                        estado(
                            where: {
                                #_or: {
                                    #nome_fantasia: {
                                    #    _ilike: "%${filter}%"
                                    #},
                                    nome: {
                                        _ilike: "%${filter}%"
                                    }
                                #},
                            },
                            limit: 10,
                        ) {
                            id
                            nome
                            sigla
                        }
                    }
                `,
            })
            .then((result) => {
                setOptionsUF(result.data.estado);
            })
            .finally((e) => {
                setLoadingUF(false);
            });
    }, 300);

    return (
        <div>
            <Card>
                <Row gutter={[5, 5]}>
                    <Col span={4}>
                        {/* <Select defaultValue="sc" style={{ width: '100%' }}>
                            <Select.Option value="sc">SC</Select.Option>
                        </Select> */}
                        <Select
                            //defaultValue="weg"
                            style={{ width: '100%' }}
                            showSearch
                            allowClear
                            showArrow={false}
                            value={valueUF}
                            loading={loadingUF}
                            filterOption={false}
                            onChange={(value) => {
                                //console.log(value);
                                setValueUF(value);
                            }}
                            onSearch={(filter) => {
                                buscaEstados(filter);
                            }}
                            options={optionsUF.map((item, k) => {
                                return {
                                    value: item.id,
                                    label: `${item.nome}-${item.sigla}`,
                                };
                            })}
                        ></Select>
                    </Col>
                    <Col span={10}>
                        <Select
                            //defaultValue="weg"
                            style={{ width: '100%' }}
                            showSearch
                            allowClear
                            showArrow={false}
                            value={value}
                            loading={loading}
                            filterOption={false}
                            onChange={(value) => {
                                setValue(value);
                            }}
                            onSearch={(filter) => {
                                buscaEmpresas(filter);
                            }}
                        >
                            {options.map((item, k) => {
                                return (
                                    <Select.Option key={k} value={item.cnpj}>
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
                                                faturamento_aggregate(
                                                    distinct_on: [
                                                        ano
                                                        trimestre
                                                    ]
                                                    where: {_and: {cnpj_empresa: {${
                                                        value
                                                            ? `_eq:"${value}"`
                                                            : '_gte: ""'
                                                    }}, ano: {_gte: 2018}}}
                                                ) {
                                                    aggregate {
                                                        sum {
                                                            vl_faturamento
                                                            vl_lucro_liquido
                                                        }
                                                    }
                                                    nodes {
                                                        trimestre
                                                        ano
                                                        vl_faturamento
                                                        vl_lucro_liquido
                                                    }
                                                }
                                            }
                                        `,
                                    })
                                    .then((result) => {
                                        dados =
                                            result.data.faturamento_aggregate
                                                .nodes;

                                        const anual = _.groupBy(dados, 'ano');
                                        setFatAnual2018(
                                            anual['2018'].map(
                                                (item) => item.vl_faturamento
                                            )
                                        );
                                        setFatAnual2019(
                                            anual['2019'].map(
                                                (item) => item.vl_faturamento
                                            )
                                        );
                                        setFatAnual2020(
                                            anual['2020'].map(
                                                (item) => item.vl_faturamento
                                            )
                                        );

                                        dados = dados.reduce((obj, item) => {
                                            obj[
                                                `${item.ano}${item.trimestre}`
                                            ] = item;
                                            return obj;
                                        }, {});
                                        setTrimestre(1);
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
                                setTrimestre(e.target.value);
                            }}
                            value={trimestre}
                        >
                            <Radio.Button value="1">1º Trimestre</Radio.Button>
                            <Radio.Button value="2">2º Trimestre</Radio.Button>
                            <Radio.Button value="3">3º Trimestre</Radio.Button>
                            <Radio.Button value="4">4º Trimestre</Radio.Button>
                        </Radio.Group>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="2018"
                                value={fatAno2018}
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
                                value={fatAno2019}
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
                                value={fatAno2020}
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
                                    '1º Trimestre',
                                    '2º Trimestre',
                                    '3º Trimestre',
                                    '4º Trimestre',
                                    '1º Trimestre',
                                    '2º Trimestre',
                                    '3º Trimestre',
                                    '4º Trimestre',
                                    '1º Trimestre',
                                    '2º Trimestre',
                                    '3º Trimestre',
                                    '4º Trimestre',
                                ],
                                datasets: [
                                    {
                                        label: '2018',
                                        fill: false,
                                        data: fatAnual2018,
                                        borderColor: 'red',
                                    },
                                    {
                                        label: '2019',
                                        fill: false,
                                        data: fatAnual2019,
                                        borderColor: 'blue',
                                    },
                                    {
                                        label: '2020',
                                        fill: false,
                                        data: fatAnual2020,
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
                                        label: '2018',
                                        fill: false,
                                        data: fatAnual2018,
                                        borderColor: 'red',
                                    },
                                    {
                                        label: '2019',
                                        fill: false,
                                        data: fatAnual2019,
                                        borderColor: 'blue',
                                    },
                                    {
                                        label: '2020',
                                        fill: false,
                                        data: fatAnual2020,
                                        borderColor: 'green',
                                    },
                                ],
                            }}
                            //   width={100}
                            //   height={50}
                            //   options={{ maintainAspectRatio: false }}
                        />
                    </Col>
                    <Col span={12}>
                        <Bar
                            data={{
                                labels: [
                                    '1º Trimestre',
                                    '2º Trimestre',
                                    '3º Trimestre',
                                    '4º Trimestre',
                                ],
                                datasets: [
                                    {
                                        label: '2018',
                                        fill: false,
                                        data: fatAnual2018,
                                        backgroundColor: 'red',
                                    },
                                    {
                                        label: '2019',
                                        fill: false,
                                        data: fatAnual2019,
                                        backgroundColor: 'blue',
                                    },
                                    {
                                        label: '2020',
                                        fill: false,
                                        data: fatAnual2020,
                                        backgroundColor: 'green',
                                    },
                                ],
                            }}
                            //   width={100}
                            //   height={50}
                            //   options={{ maintainAspectRatio: false }}
                        />
                    </Col>
                </Row>
            </Card>
            <Divider />
            <Card title="Variação Preço Ações">
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Radio.Group defaultValue="on" size="large">
                            <Radio.Button value="on">Ordinárias</Radio.Button>
                            <Radio.Button value="pn">
                                Preferenciais
                            </Radio.Button>
                        </Radio.Group>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Line
                            options={{
                                scales: {
                                    yAxes: [
                                        {
                                            ticks1: {
                                                max: 1,
                                                min: -1,
                                                //beginAtZero: true,
                                            },
                                        },
                                    ],
                                },
                            }}
                            data={{
                                labels: [
                                    '',
                                    '1º Trimestre',
                                    '2º Trimestre',
                                    '3º Trimestre',
                                    '4º Trimestre',
                                ],
                                datasets: [
                                    {
                                        label: '2018',
                                        fill: false,
                                        data: [0, 0.1, 0.15, 0.16, 0.16],
                                        borderColor: 'red',
                                    },
                                    {
                                        label: '2019',
                                        fill: false,
                                        data: [0, 0.1, 0.14, 0.13, 0.14],
                                        borderColor: 'blue',
                                    },
                                    {
                                        label: '2020',
                                        fill: false,
                                        data: [0, -0.05, -0.08, 0.02, 0.04],
                                        borderColor: 'green',
                                    },
                                ],
                            }}
                        />
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

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

    render() {
        const a = toJS(this.dados);

        const b = [].concat(
            _.values(a[2018]),
            _.values(a[2019]),
            _.values(a[2020])
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
                                            console.log(
                                                result.data.empresa_acao
                                            );

                                            dados = result.data.faturamento.reduce(
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
            </div>
        );
    }
}
