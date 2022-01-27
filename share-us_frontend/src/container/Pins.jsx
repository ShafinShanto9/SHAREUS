import React, { useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import CreatePin from '../components/CreatePin';
import Feed from '../components/Feed';
import NavBar from '../components/NavBar';
import PinDeatail from '../components/PinDeatail';
import Search from '../components/Search';


const Pins = ({user}) => {
  const [searchTerm, setSearchTerm] = useState('')
  return (
    <div className='px-2 md:px-5'>
        <div className='bg-gray-50'>
          <NavBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user} />
        </div>
        <div className='h-full'>
          <Routes>
            <Route path='/' element={<Feed/>} />
            <Route path='/category/:categoryId' element={<Feed/>} />
            <Route path='/pin-details/:pinId' element={<PinDeatail user={user}/>} />
            <Route path='/create-pin' element={<CreatePin user={user} />} />
            <Route path='/search' element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
          </Routes>
        </div>
       
    </div>

  )
};

export default Pins;
