import React from 'react';
import { Appointment } from '../utils/Appointment';
import { Loading } from '../components/Loading';
import { FormAddBilling } from '../containers/FormAddBilling';

export class AddBilling extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            pasien: {},
        }

        Appointment.getDetailPasien(this.props.match.params.id).then(response => {
            if (response.status === 200) {
                this.setState({
                    loading: false,
                    pasien: response.result
                })
                console.log(this.state.pasien.nama)
            } else {
                alert('Data tidak ditemukan')
                this.props.history.push('/all-pasien')
            }
        })

        this.handleFormSubmit = this.handleFormSubmit.bind(this)
    }

    handleFormSubmit(e) {
        e.preventDefault()
        this.setState({
            loading: true
        })

        const data = new FormData(e.target)
        const dataJson = []

        data.forEach((val, key) => {
            if (val !== "") {
                let name = key.split('.');
                if (name.length > 1) {
                    let last = name.pop()
                    name.reduce((prev, next) => {
                        return prev[next] = prev[next] || {};
                    }, dataJson)[last] = val
                }
                else {
                    dataJson[key] = val
                }
            }
        })

        Appointment.addBilling(dataJson).then(response => {
            console.log(dataJson)
            if (response.status === 200) {
                this.setState({
                    loading: false,
                    pasien: response.result
                })
                alert(`Sukses menambahkan billing pasien `)

            }
            else {
                this.setState({
                    loading: false
                })
                console.log(response.status)
                alert(`Gagal menambahkan billing pasien`)
            }
        })
    }

    render() {
        if (this.state.loading) {
            return (
                <Loading msg="Fetching Data..." />
            )
        } else {
            return (
                <FormAddBilling pasien={this.state.pasien} onSubmit={this.handleFormSubmit} />
            )
        }
    }
}