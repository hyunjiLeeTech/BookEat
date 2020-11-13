import React from 'react';
import ReactLoading from 'react-loading';
import './FullscreenLoading.css'

const FullScrrenLoading = ({ type, color }) => (
	<div id="fullScreenLoadingWrapper">
        <ReactLoading id='load-animation' type={type} color={color} height={'20%'} width={'20%'} />
    </div>
    
);

export default FullScrrenLoading;