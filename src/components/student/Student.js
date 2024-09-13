import React, { useEffect, useState } from 'react'
import { Alert, Button, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap'

import { useDispatch, useSelector } from 'react-redux';
import { addNewStudent, deleteStudent, getAlll, resetStatusAndMessage, search, searchStudent, searchStudentByXepLoai, searchStudentByYear, updateStudent } from '../../redux/studentSlice';
import ReactPaginate from 'react-paginate';
export default function Student() {
    const [currentPage, setCurrentPage] = useState(0)
    // const [localMessage, setLocalMessage] = useState("");
    // const [localStatus, setLocalStatus] = useState("")
    const [showMessage, setShowMessage] = useState(false)

    const limit = 5
    const dispatch = useDispatch();

    const status = useSelector((state) => state.student.status)
    const message = useSelector((state) => state.student.message)
    const error = useSelector((state) => state.student.error)

    console.log(status)
    const [modal, setModal] = useState(false);
    const toggle = () => {

        setModal(!modal)
        if (modal) {
            dispatch(resetStatusAndMessage)
        }
    };

    console.log(modal)
    useEffect(() => {
        if (status && message) {
            if (status === 200) {
                setModal(false)
            }
            // setLocalMessage(message)
            // setLocalStatus(status)
            setShowMessage(true)
            const time = setTimeout(() => {
                setShowMessage(false)
                dispatch(resetStatusAndMessage())
            }, 10000);
            return () => clearTimeout(time)
        }

    }, [status, message])




    const { totalPages, students } = useSelector((state) => state.student)
    // console.log(students);
    // console.log(totalPages);
    const handlePageClick = (event) => {
        setCurrentPage(event.selected)
    }



    const [stu, setStu] = useState({
        "ten": "",
        "thanhPho": "",
        "ngaySinh": "",
        "xepLoai": ""
    })




    const handle_Change = (e) => {
        const { name, value } = e.target;

        setStu(preStudent => ({
            ...preStudent,
            // [name]: convertDateToddMMyyyy(value)
            [name]: value
        }))

    }
    const handle_delete = (id) => {
        dispatch(deleteStudent(id)).then(() => (dispatch(getAlll({ currentPage, limit }))))
    }

    const handle_add = () => {
        // setStu(preStudent => ({
        //     ...preStudent,
        //     // [name]: convertDateToddMMyyyy(value)
        //     ngaySinh: convertDateToddMMyyyy(preStudent.ngaySinh),
        //     xepLoai: preStudent.xepLoai == '' ? "Giỏi" : preStudent.xepLoai
        // }))
        const stu1 = { ...stu, ngaySinh: convertDateToddMMyyyy(stu.ngaySinh), xepLoai: stu.xepLoai == "" ? "Giỏi" : stu.xepLoai }

        // console.log(stu)

        dispatch(addNewStudent(stu1)).then(() => (dispatch(getAlll({ currentPage, limit }))))
        setStu({
            "ten": "",
            "thanhPho": "",
            "ngaySinh": "",
            "xepLoai": ""
        })
        // toggle()
    }

    const convertDateToddMMyyyy = (date) => {
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    }

    const convertDateToyyyyMMdd = (date) => {
        const [day, month, year] = date.split('-');
        return `${year}-${month}-${day}`;
    }


    const XepLoaiEnum = {
        GIOI: "Giỏi",
        KHA: "Khá",
        TRUNG_BINH: "Trung bình",
        YEU5: "Yếu"
    };


    const convertToValue = (enumCode) => {
        switch (enumCode) {
            case "GIOI":
                return XepLoaiEnum.GIOI;
            case "KHA":
                return XepLoaiEnum.KHA;
            case "TRUNG_BINH":
                return XepLoaiEnum.TRUNG_BINH;
            case "YEU5":
                return XepLoaiEnum.YEU5;
            default:
                return null;
        }
    };

    const [EStudent, setEStudent] = useState({ "id": "", "ten": "", "thanhPho": "", ngaySinh: "", xepLoai: "" })
    const [studentEdit, setStudentEdit] = useState({ isEdit: false, id: "" })


    const handle_edit = (id, item) => {
        // console.log(item)
        setStudentEdit({ isEdit: true, id })
        setEStudent(item)
    }
    // console.log(EStudent)
    const handle_save = (id) => {
        dispatch(updateStudent({
            id,
            student: {
                ...EStudent,
                ngaySinh: convertDateToyyyyMMdd(EStudent.ngaySinh), // Sử dụng định dạng YYYY-MM-DD
                // xepLoai:  EStudent.xepLoai
                xepLoai: EStudent.xepLoai == "GIOI" || EStudent.xepLoai == "KHA" || EStudent.xepLoai == "TRUNG_BINH" || EStudent.xepLoai == "YEU5" ?
                    convertToValue(EStudent.xepLoai)
                    :
                    EStudent.xepLoai // Sử dụng giá trị phù hợp với enum
            }

        })
        );
        setStudentEdit({ isEdit: false, id: "" })
    }


    useEffect(() => {
        dispatch(getAlll({ currentPage, limit }))
    }, [currentPage, dispatch])

    const [keyWord, setKeyWord] = useState('')
    const [searchApi, setSearchApi] = useState('')
    const filterStudent = (students || []).filter(student =>
        student.ten.toLowerCase().includes(keyWord.toLowerCase())
    )

    const [xl, setXl] = useState('Giỏi')
    // console.log(xl)
    const handle_search = () => {
        dispatch(searchStudent(searchApi))
    }
    // const handle_searchStudentByXepLoai = () => {
    //     dispatch(searchStudentByXepLoai(xl))
    // }
    useEffect(() => {
        dispatch(searchStudentByXepLoai(xl))
    }, [xl])
    const [studentSearch, setStudentSearch] = useState({ "xepLoai": "Giỏi", "ten": "hao", "startYear": 2001, "endYear": 2024 })

    const [startYear, setStartYear] = useState(2001)
    const [endYear, setEndYear] = useState(2024)
    const handle_searchByYear = () => {
        dispatch(searchStudentByYear({ startYear, endYear }))
    }
    // console.log(studentSearch)
    useEffect(() => {
        dispatch(search(studentSearch))
    }, [studentSearch])
    return (
        <div>
            <h1>Total: {totalPages}</h1>
            <Input type='select' name='xepLoai' value={xl}
                onChange={(e) => {
                    setXl(e.target.value)
                }}
            >
                <option>Giỏi</option>
                <option>Khá</option>
                <option>Trung bình</option>
                <option>Yếu</option>
            </Input>
            <div className='my-3 d-flex'>
                <Input
                    type='number'
                    value={startYear}
                    onChange={(e) => (
                        setStartYear(e.target.value)
                    )}
                />
                <Input
                    type='number'
                    value={endYear}
                    onChange={(e) => (
                        setEndYear(e.target.value)
                    )}
                />
                <Button onClick={handle_searchByYear}>find</Button>
            </div>
            {/* <Input type='text' name='keyword' value={keyWord} onChange={(e) => setKeyWord(e.target.value)} /> */}
            <Input type='text' placeholder='search api' name='keyword' value={searchApi} onChange={(e) => setSearchApi(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key == "Enter") {
                        handle_search()
                    }
                }} />
            <div className='searchAll'>
                <Input type='select' name='xepLoai' value={studentSearch.xepLoai}
                    onChange={(e) => {
                        setStudentSearch({ ...studentSearch, "xepLoai": e.target.value })
                    }}
                >
                    <option>Giỏi</option>
                    <option>Khá</option>
                    <option>Trung bình</option>
                    <option>Yếu</option>
                </Input>
                <div className='my-3 d-flex'>
                    <Input
                        type='number'
                        value={studentSearch.startYear}
                        onChange={(e) => (
                            setStudentSearch({ ...studentSearch, "startYear": e.target.value })
                        )}
                    />
                    <Input
                        type='number'
                        value={studentSearch.endYear}
                        onChange={(e) => (
                            setStudentSearch({ ...studentSearch, "endYear": e.target.value })
                        )}
                    />
                </div>
                <Input
                    type='text' placeholder='SearchAPI'
                    className='my-3'
                    value={studentSearch.ten}
                    onChange={(e) => (
                        setStudentSearch({ ...studentSearch, "ten": e.target.value })
                    )}
                />
            </div>
            <Button color="success" onClick={toggle}>
                Thêm thông tin học sinh
            </Button>
            <Modal isOpen={modal} toggle={toggle} >
                {
                    error && (
                        <Alert color='danger'>
                            <ul>
                                {error.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </Alert>
                    )
                }
                <ModalHeader toggle={toggle}>Modal title</ModalHeader>
                <FormGroup>
                    <ModalBody>

                        Họ và tên:
                        <Input
                            name='ten'
                            type='text'
                            placeholder='Nhập họ và tên'
                            value={stu.ten}
                            onChange={handle_Change}
                        />
                        Thành phố:
                        <Input
                            name='thanhPho'
                            type='text'
                            placeholder='Nhập thành phố'
                            value={stu.thanhPho}
                            onChange={handle_Change}
                        />
                        Ngày sinh:
                        <Input
                            name="ngaySinh"
                            placeholder="datetime placeholder"
                            type="date"
                            // value={convertDateToyyyyMMdd(stu.ngaySinh)}
                            value={stu.ngaySinh}
                            onChange={handle_Change}
                        />
                        Xếp loại
                        <Input
                            name='xepLoai'
                            type='select'
                            value={stu.xepLoai}
                            onChange={handle_Change}
                        >
                            <option>Giỏi</option>
                            <option>Khá</option>
                            <option>Trung bình</option>
                            <option>Yếu</option>
                        </Input>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handle_add}>
                            Do Something
                        </Button>
                        <Button color="secondary" onClick={toggle}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </FormGroup>
            </Modal>

            {showMessage && (
                <Alert color={status === 200 ? "success" : "danger"}>
                    {message}
                </Alert>
            )}
            <Table striped>
                <thead>
                    <tr>
                        <th>
                            #
                        </th>
                        <th>
                            Tên sinh viên
                        </th>
                        <th>
                            Thành phố
                        </th>
                        <th>
                            Delete
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        students && students.map((item, index) => (
                            <tr key={index} className={studentEdit.isEdit && item.id === studentEdit.id ? "student-item active" : "student-item"}>
                                <td>{index + 1}</td>
                                <td>
                                    {studentEdit.isEdit && item.id === studentEdit.id ?
                                        <Input type="hidden" value={EStudent.id}
                                            onChange={(e) => setEStudent({ ...EStudent, id: e.target.value })}
                                        />
                                        :
                                        item.id
                                    }
                                </td>
                                <td scope="row">
                                    {studentEdit.isEdit && item.id === studentEdit.id ?
                                        <Input type="text" value={EStudent.ten}
                                            onChange={(e) => setEStudent({ ...EStudent, ten: e.target.value })}
                                        />
                                        :
                                        item.ten
                                    }
                                </td>
                                <td>
                                    {studentEdit.isEdit && item.id === studentEdit.id ?
                                        <Input type="text" value={EStudent.thanhPho}
                                            onChange={(e) => setEStudent({ ...EStudent, thanhPho: e.target.value })}
                                        />
                                        :
                                        item.thanhPho
                                    }
                                </td>
                                <td>
                                    {
                                        studentEdit.isEdit && item.id === studentEdit.id ?
                                            <Input

                                                type="date"
                                                value={EStudent.ngaySinh}
                                                onChange={(e) => setEStudent({ ...EStudent, ngaySinh: e.target.value })}
                                            />
                                            :
                                            convertDateToddMMyyyy(item.ngaySinh)

                                    }
                                </td>
                                <td>
                                    {studentEdit.isEdit && item.id === studentEdit.id ?
                                        <Input
                                            id="xepLoai"
                                            name="xepLoai"
                                            type="select"
                                            value={convertToValue(EStudent.xepLoai)}
                                            onChange={(e) => setEStudent({ ...EStudent, xepLoai: e.target.value })}
                                        >
                                            <option>Giỏi</option>
                                            <option>Khá</option>
                                            <option>Trung bình</option>
                                            <option>Yếu</option>
                                        </Input>
                                        :
                                        convertToValue(item.xepLoai)
                                    }
                                </td>
                                <td>
                                    {studentEdit.isEdit && item.id === studentEdit.id ?
                                        <Button className="btn btn-success"
                                            onClick={() => handle_save(item.id)}
                                        >Save </Button>
                                        :
                                        <>
                                            <Button onClick={() => handle_delete(item.id)} className='btn btn-danger'>Delete </Button>
                                            <Button className="btn btn-success" onClick={() => handle_edit(item.id, item)}>
                                                Edit
                                            </Button>
                                        </>
                                    }

                                </td>

                            </tr>
                        ))
                    }

                </tbody>
            </Table>
            <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                pageCount={Math.ceil(totalPages)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                nextClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextLinkClassName={'page-link'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                activeClassName={'active'}
            />
        </div>
    )
}
