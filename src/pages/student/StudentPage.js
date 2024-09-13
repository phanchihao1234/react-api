import React, { useState } from 'react'
import Header from '../../components/header/Header'
import Student from '../../components/student/Student'
import { Input } from 'reactstrap'

export default function StudentPage() {

  return (
    <div>
      <Header />
      <h1>Student page</h1>


      <Student />
    </div>
  )
}
