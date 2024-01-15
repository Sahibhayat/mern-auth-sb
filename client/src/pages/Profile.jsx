import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRef } from 'react'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from 'firebase/storage'
import { app } from '../firebase'
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure
} from '../redux/user/userSlice'

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector(state => state.user)
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSeccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = () => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadurl) => {
          setFormData({ ...formData, profilePicture: downloadurl })
        })
      })
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'Application/json'
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data))
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error))
    }
  }


  return (
    // fire base storage rules
    // allow read;
    //   allow write: if
    //   request.resource.size < 2 * 1024 * 1024  && 
    //   request.resource.contentType.matches('image/.*')
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold">
        Profile
      </h1>
      <form onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <input type="file" accept="image/*"
          ref={fileRef} hidden
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt="profile"
          className='h-24 w-24 self-center cursor-pointer 
          rounded-full object-cover mt-2'
          onClick={() => fileRef.current.click()}
        />
        <p className='text-sm self-center'>
          {
            imageError ?
              <span className="text-red-700">Error uploading
                image</span> : imagePercent > 0 &&
                  imagePercent < 100 ?
                <span className='text-slate-700'>
                  {`Uploadin:  ${imagePercent} %`}
                </span> : imagePercent === 100 ?
                  <span className="text-green-700">
                    Image uploaded successfully
                  </span> : ''
          }
        </p>
        <input type="text" id="username"
          placeholder="Username" className="bg-slate-100
          rounded-lg p-3"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input type="email" id="email"
          placeholder="Email" className="bg-slate-100
          rounded-lg p-3"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input type="password" id="password"
          placeholder="Password" className="bg-slate-100
          rounded-lg p-3"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white p-3
        rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading? 'Loading...' : 'update'}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className='text-red-700 mt-6'>
        {error && 'Something went wrong!'}
      </p>
      <p className='text-green-700 mt-6'>
        {updateSeccess && 'User updated successfully!'}
      </p>
    </div>
  )
}
