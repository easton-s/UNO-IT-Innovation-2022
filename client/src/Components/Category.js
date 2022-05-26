import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import DATA from '../Library/official_data.json';

import '../styles/App.css';

import Statistic from './Statistic';

const Category = ({ socket }) => {
    const [ industry, setIndustry ] = useState('');
    const [ industryData, setIndustryData ] = useState({});
    const { category } = useParams();
    
    useEffect(()=>{
        setIndustry(category.replaceAll('_', ' '));
    }, [category]);

    useEffect(()=>{
        if(industry !== ''){
            setIndustryData(DATA[industry]);
        }
    }, [industry]);

    //create a string to accurately describe the data
    const returnStatString = (stat, data, parent)=>{
        if(data.type === 'Number'){
            if(stat.includes('Income')){
                return `$${data.value.toFixed(2)}`;
            }
            return `${data.value.toFixed(0)} people`;
        } else{
            return `${data.value.toFixed(2)}% of the industry`;
        }
    };

    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState({});

    const changeModal = (data)=>{
        setModalData(data);
        setModalOpen(true);
    };

    return (
        <div className="home">
            <h2>Nebraska Statistics for</h2>
            <h1>{industry}</h1>
            <h2>Click on any statistic to view a real-life representation</h2>
            <Link to="/" className="back-to-home">
                <span>Back to Home</span>
            </Link>
            <div className="industry-categories">
                {
                    Object.keys(industryData).map((category_name, index) => {
                        return (
                            <div className="industry-category" key={index}>
                                <h3>{category_name}</h3>
                                <div className="category-statistics">
                                    {
                                        Object.keys(industryData[category_name]).map((statistic_name, index2) => {
                                            return (
                                                <div className="category-statistic" key={index2} style={{
                                                    backgroundColor: index % 2 === 0 ? '#4499B0' : '#5b44b0'
                                                }} onClick={()=>changeModal({
                                                    statistic: {
                                                        name: statistic_name,
                                                        data: industryData[category_name][statistic_name]
                                                    },
                                                    parent: {
                                                        name: category_name,
                                                        data: industryData[category_name]['overall']
                                                    },
                                                    industry: industry,
                                                    total_employed: industryData['overall']['Total Employed']
                                                })}>
                                                    <span>{statistic_name}</span>
                                                    <span className="statistic-value">{returnStatString(statistic_name, industryData[category_name][statistic_name], category_name)}</span>
                                                </div>
                                            )                                     
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <Statistic data={modalData} open={modalOpen} setOpen={setModalOpen} socket={socket} />
        </div>
    );
};

export default Category;