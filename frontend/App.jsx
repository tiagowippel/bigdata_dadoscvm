'use strict';

import React from 'react';
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
    Layout,
    Menu,
    Card,
    Statistic,
    Select,
    Row,
    Col,
    Radio,
    Divider,
} from 'antd';
const { Header, Content, Footer, Sider } = Layout;

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
                            <Menu.Item key="2">
                                <Link to="/porSetor">Por Setor</Link>
                            </Menu.Item>
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
                                    component={PorEmpresa}
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

const PorEmpresa = (props) => (
    <div>
        <Card>
            <Row gutter={[5, 5]}>
                <Col span={4}>
                    <Select defaultValue="sc" style={{ width: '100%' }}>
                        <Select.Option value="sc">SC</Select.Option>
                    </Select>
                </Col>
                <Col span={12}>
                    <Select defaultValue="weg" style={{ width: '100%' }}>
                        <Select.Option value="weg">WEG S.A.</Select.Option>
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
                        <Radio.Button value="pn">Preferenciais</Radio.Button>
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

const PorSetor = (props) => (
    <div>
        <Card>
            <Row gutter={[5, 5]}>
                <Col span={4}>
                    <Select defaultValue="todos" style={{ width: '100%' }}>
                        <Select.Option value="todos">
                            Todos estados
                        </Select.Option>
                        <Select.Option value="sc">SC</Select.Option>
                    </Select>
                </Col>
                <Col span={12}>
                    <Select defaultValue="aliment" style={{ width: '100%' }}>
                        <Select.Option value="aliment">
                            Alimentício
                        </Select.Option>
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
                        <Radio.Button value="pn">Preferenciais</Radio.Button>
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
