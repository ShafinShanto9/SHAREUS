import React from 'react';
import { urlFor,client } from '../client';
import {v4 as uuidv4} from 'uuid'
import {MdDownloadForOffline} from 'react-icons/md'
import {AiTwotoneDelete} from 'react-icons/ai'
import {BsFillArrowUpRightCircleFill} from 'react-icons/bs'
import { useState, } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUser } from '../utils/fetchUser';

const Pin = ({pin: {image, postedBy, _id, destination,save}}) => {

  const [postHoverd, setPostHoverd] = useState(false)

  const navigate = useNavigate()
  const user = fetchUser()
  const alReadySaved = !!(save?.filter((item) => item.postedBy._id === user.googleId ))?.length

  const savePin =(id) =>{
    if(!alReadySaved){
      client
        .patch(id)
        .setIfMissing({save: []})
        .insert('after','save[-1]', [{
          _key: uuidv4(),
          userId: user.googleId,
          postedBy: {
            _type: 'postedBy',
            _ref: user.googleId
          }
        }])
        .commit()
        .then(()=>{
          window.location.reload()
        })
    }
  }

  const deletePin =(id) =>{
    client
      .delete(id)
      .then(()=>{
        window.location.reload()
      })
  }
  return (
      <div className='m-2'>
        <div
          onMouseEnter={()=>setPostHoverd(true)}
          onMouseLeave={()=>setPostHoverd(false)}
          onClick={()=>navigate(`/pin-details/${_id}`)}
          className='relative cursor-zoom-in w-auto hover:shadow:lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
        >
            <img className='rounded-lg w-full' alt='user-post' src={urlFor(image).width(250).url()} />
            {
              postHoverd && (
                <div 
                className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pb-2 pt-2 z-50 '
                style={{height: "100%"}}
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex gap-2'>
                      <a href={`${image?.asset?.url}?dl=`} download onClick={(e)=> e.stopPropagation()}
                      className='bg-white h-9 w-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                      >
                        <MdDownloadForOffline/>
                      </a>
                    </div>
                    {alReadySaved ? (
                      <button className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'>
                       {save?.length} saved
                      </button>
                    ): (
                      <button
                      onClick={(e)=>{
                        e.stopPropagation()
                        savePin(_id)
                      }}
                      type='button' className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'>
                        save
                      </button>
                    )
                    }
                  </div>
                  <div className='flex justify-between items-center gap-2 w-full'>
                      {destination && (
                        <a href={destination}
                        target="_blank"
                        rel='noreferrer'
                        className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100
                        hover:shadow-md'>
                          <BsFillArrowUpRightCircleFill/>
                          {destination.length > 20 ? destination.slice(8,20): destination.slice(8)}
                        </a>
                      )}
                      {postedBy?._id === user.googleId && (
                        <button
                        onClick={(e)=>{
                          e.stopPropagation()
                          deletePin(_id)
                        }}
                        type='button'
                        className='bg-white p-2 opacity-70 hover:opacity-100 text-dark font-bold text-base rounded-3xl hover:shadow-md outline-none'
                        >
                          <AiTwotoneDelete/>
                        </button>
                      )}
                  </div>
                </div>
              )
            }
        </div> 
        <Link to={`user-profile/${postedBy?._id}`} className='flex gap-2 mt-2 items-center'>
          <img src={postedBy?.image} className='w-8 h-8 rounded-full object-cover ' alt="user-profile" />
          <p className='font-semibold capitalize'> {postedBy?.userName}</p>
        </Link>
      </div>
  )
};

export default Pin;
