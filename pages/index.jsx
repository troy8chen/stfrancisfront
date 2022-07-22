
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import { parse, isDate } from 'date-fns'

import { userService } from '../services/user.service';

import Client from '../components/Client'

import * as Yup from 'yup'

const clientLookupSchema = Yup.object().shape({
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    middleInitial: Yup.string().notRequired().when('middleInitial', {is: (value) => value?.length, then: (rule) => rule.length(1)}),
    dateOfBirth: Yup.date().transform(parseDateString).required()
}, ['middleInitial', 'middleInitial'])

function parseDateString(value, originalValue) {
    const parsedDate = isDate(originalValue)
    ? originalValue
    : parse(originalValue, "yyyy-MM-dd", new Date())
    return parsedDate
}

export default function Home() {

    const { register, handleSubmit, errors } = useForm({
        resolver: yupResolver(clientLookupSchema)
    })

    const [users, setUsers] = useState(null)
    const [client, setClient] = useState(null)
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [progVal, setProgVal] = useState(5)

    const [submitErrors, setSubmitErrors] = useState({
        firstName: null,
        lastName: null,
        middleInitial: null,
        dateOfBirth: null
    })

    const [touched, setTouched] = useState({
        firstName: false,
        lastName: false,
        middleInitial: false,
        dateOfBirth: false
    })

    const submitForm = (data) => {
        setSubmitErrors({
            firstName: null,
            lastName: null,
            middleInitial: null,
            dateOfBirth: null
        })
        setSubmitted(true)
        setLoading(true)

        setClient(data) //setLocally for easy tracking
        console.log(client)
    }

    const handleError = (err) => {
        setSubmitErrors({
            firstName: err.firstName,
            lastName: err.lastName,
            middleInitial: err.middleInitial,
            dateOfBirth: err.dateOfBirth
        })

        setTouched({
            firstName: true,
            lastName: true,
            middleInitial: true,
            dateOfBirth: true
        })
    }

    useEffect(() => {
        userService.getAll().then(x => setUsers(x));
    }, []);

    return (
        <div className="flex flex-col min-w-full min-h-screen overflow-x-hidden">
            <form onSubmit={handleSubmit(submitForm, handleError)} className="card mt-10 mx-auto">
                    <div className='card-body min-w-full'>
                        <h1 className='card-title text-primary-content my-0'>Lookup Client</h1>
                        <div className='divider my-0'></div>
                        <div className="form-control flex-row">

                            {/* First Name */}
                            <div className='p-2 w-60 flex flex-col'>
                            <label className="label label-text">First name</label>
                            <input type="text" name="firstName" {...register('firstName')} onClick={() => setTouched({...touched, firstName: true})} className="input input-bordered min-w-sm p-2" />
                            {submitErrors.firstName && touched.firstName ? <label className='label-text-alt badge badge-error m-1'>required</label> : null}
                            </div>

                            {/* Last Name */}
                            <div className="p-2 w-60 flex flex-col">
                            <label className="label label-text">Last name</label>
                            <input type="text" name="lastName" {...register('lastName')} onClick={() => setTouched({...touched, lastName: true})} className="input input-bordered min-w-sm p-2" />
                            {submitErrors.lastName && touched.lastName ? <label className="label-text-alt badge badge-error m-1">required</label> : null}
                            </div>

                            {/* Middle Initial */}
                            <div className="p-2 w-60 flex flex-col">
                            <label className="label label-text">Middle Initial</label>
                            <input type="text" name="middleInitial" {...register('middleInitial')} onClick={() => setTouched({...touched, middleInitial: true})} className="input input-bordered min-w-sm p-2" />
                            {submitErrors.middleInitial && touched.middleInitial ? <label className='label-text-alt badge badge-error'>Middle Initial must only be one letter</label> : null}
                            </div>

                            {/* Date of Birth */}
                            <div className="p-2 w-64 flex flex-col">
                                <label className="label label-text">Date of Birth</label>
                                <input type="date" name="dateOfBirth" {...register('dateOfBirth')} placeholder="date" onClick={() => setTouched({...touched, dateOfBirth: true})} className="input input-bordered min-w-sm p-2"></input>
                                <label className={`label-text-alt badge badge-error m-1 ${submitErrors.dateOfBirth && touched.dateOfBirth ? "visible" : "hidden"}`}>required</label>
                            </div>
                        </div>
                        <div className='card-actions justify-end my-0'>
                            <button type="submit" className="btn btn-primary p-2 my-2 mr-1">Search</button>
                        </div>
                        <div className='divider my-0'></div>
                    </div>
            </form>
            {/* Render client list */}
            <div className={`${submitted ? "visible" : "hidden"} mx-auto container`}>
                <Client client={client} />
            </div>
        </div>
    )
}