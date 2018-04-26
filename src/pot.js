import React from 'react'

export default function Pot(props) {
    return (
        <div className="shadow-inactive rounded p-3 mb-5 bg-white">
            <p>{props.name} amount: {props.amount} credits</p>
        </div>
    );
}