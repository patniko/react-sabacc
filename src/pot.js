import React from 'react'

export default function Pot(props) {
    return (
        <div className="border border-dark rounded shadow-lg p-3 mb-5 bg-white">
            <p>{props.name} amount: {props.amount} credits</p>
        </div>
    );
}