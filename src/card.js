import React from 'react';

export default function Card(props) {
    return (
        <div className="sabaccCard">
            <img src={props.card.img} onClick={props.onClick} />
        </div>
    );
}