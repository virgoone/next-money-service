import React from 'react'
import styles from './loading.css?modules'

export default function () {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg className={styles.ring} viewBox="25 25 50 50" strokeWidth="5">
        <circle cx="50" cy="50" r="20" />
      </svg>
    </div>
  )
}
