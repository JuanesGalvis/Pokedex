import React from 'react';
import styles from '../styles/pagination.module.sass';

export const Paginacion = ({ updateState, state }) => {
    return (
        <section>
          <div className={styles.nav}>
            {
              new Array(16).fill(0).map((el, index) => {
                
                return (
                <button className={ state/10 === index ? `${styles.actual}`: 0} onClick={() => updateState(index*10)} key={`page-${index}`}>{index+1}</button>
              );})
            }
          </div>
        </section>
    );
};