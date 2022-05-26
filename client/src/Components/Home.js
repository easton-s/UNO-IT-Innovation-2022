import React from "react";
import { Link } from "react-router-dom";

import '../styles/App.css'

import DATA from '../Library/official_data.json';
import {TOTAL_PEOPLE} from '../Library/url';

const Home = ({ socket }) => {
    return (
        <div className="home">
            <h2>Our dataset represents {TOTAL_PEOPLE} people in Nebraska</h2>
            <h1>Select an Industry</h1>
            <h2>View detailed demographic statistics about the various industries in Nebraska</h2>
            <div className="home-buttons">
            {
                Object.keys(DATA).map((category_name, index) => {
                    return (
                        <Link className="category-button"
                        to={`/category/${category_name.replaceAll(' ', '_')}`} key={index}
                        >
                            <span>{category_name}</span>
                        </Link>
                    )
                })
            }
            </div>
        </div>
    );
};

export default Home;