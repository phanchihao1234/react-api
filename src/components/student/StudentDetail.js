import { upload } from '@testing-library/user-event/dist/upload';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { Alert, Button, FormGroup, Input, Table } from 'reactstrap';
import { getAllImage, resetStatusAndMessage, updateImage } from '../../redux/studentSlice';
import axios from 'axios';

export default function StudentDetail() {
    const { id } = useParams();
    const [files, setFiles] = useState([]);
    const dispatch = useDispatch();
    // console.log(files)
    const handle_change = (e) => {
        setFiles(e.target.files)
    }
    const handle_submit = (e) => {
        e.preventDefault()
        const formData = new FormData()
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i])
        }
        try {
            // setFiles([])
            dispatch(updateImage({ id, formData })).then(() => (dispatch(getAllImage(id))))
        } catch (errors) {
            console.error("Error uploading files", errors)
        }
    }
    const { studentDetail, message, error, status } = useSelector((state) => state.student)
    const [images, setImages] = useState({});
    const [showMessage, setShowMessage] = useState(false);
    const fetchImage = async (imageUrl) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/student/images/${imageUrl}`, {
                responseType: 'blob' //dam bao tra ve la blob
            })
            const imageObjectUrl = URL.createObjectURL(response.data)
            setImages(pre => ({ ...pre, [imageUrl]: imageObjectUrl }))
        } catch (error) {
            console.error("Error fetching image", error)
        }
    }
    useEffect(() => {
        if (studentDetail) {
            studentDetail.forEach(item => {
                fetchImage(item.imageUrl)
            });
        }
    }, [studentDetail, dispatch])
    useEffect(() => {
        dispatch(getAllImage(id))
    }, [dispatch, id])
    useEffect(() => {
        if (status && message) {

            setShowMessage(true)
            const time = setTimeout(() => {
                setShowMessage(false)
                dispatch(resetStatusAndMessage())
            }, 10000);
            return () => clearTimeout(time)
        }

    }, [status, message, dispatch])

    return (
        <div>
            <h1>Id: {id}</h1>
            {showMessage && (
                <Alert color={status === 200 ? "success" : "danger"}>
                    {message}
                </Alert>
            )}
            <form onSubmit={handle_submit}>
                <FormGroup>
                    <Input type='file' className='w-25' name='files' multiple onChange={handle_change} />
                    <input type='submit' className='btn btn-primary' value={"save"} />
                </FormGroup>
            </form>
            <Table hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        studentDetail && studentDetail.map((item, index) => (
                            <tr key={index}>
                                <th scope='row'>{index + 1}</th>
                                <td>{item.id}</td>
                                <td>
                                    <img src={images[item.imageUrl]} style={{ width: '100px', height: '100px' }} />
                                </td>
                                <td>
                                    <Button>delete</Button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        </div>
    )
}
