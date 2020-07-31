import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import './LandingPage.css';
import axios from 'axios';

function LandingPage() {
    const [tCode, setTCode] = useState("")
    const [tInvoice, setTInvoice] = useState("")
    const [tResults, setTResults] = useState([])
    const [tCompanyResults, setTCompanyResults] = useState([])

    const submitHandler = async (event) => {
        event.preventDefault();
        if (!tCode || !tInvoice) {
            return alert(" 모든 값을 넣어주셔야 합니다.")
        }

        try {
            let results = await axios.get(`/api/posts/trackingInfo?tCode=${tCode}&tInvoice=${tInvoice}`)
            setTResults(results.data)
        } catch (error) {
            alert(error)
        }
    }

    const tCodeChangeHandler = (e) => {
        setTCode(e.currentTarget.value)
    }

    const tInvoiceChangeHandler = (e) => {
        setTInvoice(e.currentTarget.value)
    }

    const companyHandler = async (e) => {
        e.preventDefault();
        try {
            let results = await axios.get(`/api/posts/companylist`)
            setTCompanyResults(results.data)
            console.log('results', results)
        } catch (error) {
            alert(error)
        }
    }

    const renderCompanyTable = tCompanyResults.map((tResult, index) => {
        if (tResult.Code === "05" || tResult.Code === "04" || tResult.Code === "23") {
            return <tr key={index}>
                <td>{tResult.Code}</td>
                <td>{tResult.Name}</td>
            </tr>
        }
    })

    const renderTable = tResults.map((tResult, index) => {
        return <tr key={index}>
            <td>{tResult.where}</td>
            <td>{tResult.kind}</td>
            <td>{tResult.telno}</td>
        </tr>
    })

    return (
        <div className="contentsWrap">
            <br />
            <div className="tSmallBox" style={{ textAlign: 'center' }}>
                <Button onClick={companyHandler} type="submit" className="btn btn-default">택배사 조회하기</Button>
            </div>

            {tCompanyResults.length > 0 &&
                <div className="tResultsBox">
                    <table>
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderCompanyTable}
                        </tbody>
                    </table>
                </div>
            }

            <div className="tBox">
                <Form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label htmlFor="t_code">택배사 코드</label>
                        <Input onChange={tCodeChangeHandler} type="text" className="form-control" name="t_code" id="t_code" placeholder="택배사 코드 ex) 04" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="t_invoice">운송장 번호</label>
                        <Input onChange={tInvoiceChangeHandler} type="text" className="form-control" name="t_invoice" id="t_invoice" placeholder="운송장 번호 ex) 1234567890" />
                    </div>
                    <div className="form-group" style={{ textAlign: 'center' }}>
                        <Button onClick={submitHandler} type="submit" className="btn btn-default">조회하기</Button>
                    </div>
                </Form>
            </div>

            {tResults.length > 0 &&
                <div className="tResultsBox">
                    <table>
                        <thead>
                            <tr>
                                <th>Where</th>
                                <th>Kind</th>
                                <th>TelNo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTable}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}

export default LandingPage
