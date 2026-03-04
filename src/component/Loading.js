import React from 'react'
import styles from './Loading.module.css'

export default function Loading() {
  return (
    <div className='w-full min-h-[60vh] flex items-center justify-center bg-white'>
        <div className={styles.loader} />
    </div>
  )
}