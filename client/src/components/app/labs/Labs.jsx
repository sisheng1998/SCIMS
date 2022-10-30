import React, { useState } from 'react'
import Title from '../components/Title'
import useAuth from '../../../hooks/useAuth'
import { PlusIcon } from '@heroicons/react/outline'
import ApplyNewLabModal from './ApplyNewLabModal'
import LabCard from './LabCard'
import useMobile from '../../../hooks/useMobile'

const Labs = () => {
  const [openApplyNewLabModal, setOpenApplyNewLabModal] = useState(false)
  const { auth } = useAuth()
  const isMobile = useMobile()

  return (
    <>
      <Title title='My Labs' hasButton={false} hasRefreshButton={false} />

      <div className='-mr-4 flex flex-wrap'>
        {auth.roles.map((role) => (
          <LabCard key={role._id} role={role} />
        ))}

        {!isMobile && !auth.isAdmin && (
          <div className='mb-4 w-1/5 2xl:w-1/4 xl:w-1/3 lg:w-1/2 sm:mb-0 sm:w-full'>
            <div
              className='group mr-4 flex h-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 hover:border-indigo-600 hover:bg-indigo-50'
              onClick={() => setOpenApplyNewLabModal(true)}
            >
              <PlusIcon className='h-10 w-10 stroke-1 text-gray-400 group-hover:text-indigo-600' />
              <p className='mt-2 font-medium text-gray-400 group-hover:text-indigo-600'>
                Apply New Lab
              </p>
            </div>
          </div>
        )}
      </div>

      {isMobile && !auth.isAdmin && (
        <button
          className='button button-solid fixed bottom-2 right-2 z-10 -translate-y-12 justify-center py-2 shadow-md'
          onClick={() => setOpenApplyNewLabModal(true)}
        >
          <PlusIcon className='-ml-1 mr-1.5 h-4 w-4 stroke-2' />
          Apply New Lab
        </button>
      )}

      {openApplyNewLabModal && (
        <ApplyNewLabModal
          openModal={openApplyNewLabModal}
          setOpenModal={setOpenApplyNewLabModal}
        />
      )}
    </>
  )
}

export default Labs
