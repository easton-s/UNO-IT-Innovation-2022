import React, { useEffect, useState } from "react";

import { TOTAL_LEDS } from "../Library/url";

import '../styles/App.css';

const Modal_Data_Template = {
    statistic: {
        name: 'Placeholder',
        data: {
            value: 0,
            type: 'Number'
        },
    },
    parent: {
        name: 'Placeholder',
        data: {
            value: 0,
            type: 'Number'
        },
    },
    industry: 'Placeholder Industry',
};

const Statistic = ({ data, open, setOpen, socket }) => {
    const [ visible, setVisible ] = useState(open);
    const [ modalData, setModalData ] = useState(Modal_Data_Template);

    const lightLeds = ()=>{
        let from_led = 0;
        let to_led;
        let percentage = data.value;
        if(modalData.statistic.data.type === 'Number'){
            if(modalData.statistic.data.name === 'Average Income'){
                percentage = Math.floor((modalData.statistic.data.value*100)/100000);
            } else{
                percentage = Math.floor((modalData.statistic.data.value*100)/modalData.total_employed.data.value);
            }
        }
        to_led = Math.floor((percentage*TOTAL_LEDS)/100);
        //emit to python backend
        socket.emit('light_leds', {
            from_led,
            to_led,
            color: 'blue'
        });
    };

    const formatDescription = ()=>{
        if(modalData.statistic.data.type === 'Number'){
            if(modalData.statistic.name.includes('Income')){
                return `The ${modalData.statistic.name.toLowerCase()} for ${modalData.industry} in Nebraska is $${modalData.statistic.data.value.toFixed(2)}.`;
            }
            if(modalData.statistic.name === 'Total Employed'){
                return `There are ${modalData.statistic.data.value.toFixed(0)} people employed in ${modalData.industry} in Nebraska.`;
            }
            return `The amount of people with ${modalData.statistic.name.toLowerCase()} status in the ${modalData.industry} of Nebraska is ${modalData.statistic.data.value.toFixed(0)} people.`;
        } else{
            if(modalData.parent.name === 'Education'){
                return `${modalData.statistic.data.value.toFixed(2)}% of the ${modalData.industry} industry in Nebraska have a ${modalData.statistic.name} as their higher education status.`;
            }
            if(modalData.statistic.name === 'Population'){
                return `${modalData.statistic.data.value.toFixed(2)}% of people in the ${modalData.industry} industry in Nebraska are of ${modalData.parent.name} status.`;
            }
            return `${modalData.statistic.data.value.toFixed(2)}% of the ${modalData.industry} industry in Nebraska have a ${modalData.statistic.name} status.`;
        }
    };

    useEffect(()=>{
        setVisible(open);
        if(data?.statistic){
            setModalData(data);
            lightLeds();
        }
    }, [open, data]);

    const closeModal = ()=>{
        socket.emit('clear_leds', {});
        setModalData(Modal_Data_Template);
        setOpen(false);
    };

    return (
        <div className="modal-wrapper" style={{
            display: visible ? 'block' : 'none'
        }}>
            <div className="modal">
                <div className="modal-header">
                    <div className="modal-title">
                        <span>{data?.statistic?.name}</span>
                        <span>The LED representation is currently being displayed.</span>
                    </div>
                    <span onClick={()=>closeModal()} style={{cursor: 'pointer'}}>✖</span>
                </div>
                <div className="modal-body">
                    <p>{formatDescription()}</p>
                    {
                        modalData.statistic.name === 'Average Income'
                        ? <p style={{fontSize: '0.9rem'}}>100% of LEDs illuminated is equal to $100,000.00</p>
                        : ''
                    }
                </div>
            </div>
            <div className="modal-overlay" onClick={()=>closeModal()}></div>
        </div>
    )
};

export default Statistic;