//Libraries and CSS
import React from 'react';
import css from './alert.module.css'

const alert = props => {
    return (<>

        <div className={props.show?css.overlay:css.overlayClose}>
            <div className={css.popup}>
                <h2>{props.type}</h2>
                <div className={css.close} onClick={props.clicked}>&times;</div>
                <div className={css.content}>
                    {props.msg}
		</div>
            </div>
        </div>
    </>);
}

export default alert;