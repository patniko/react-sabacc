import React from 'react'

export default function Pot(props) {
    return (
        <div className="rounded p-1 shadow-inactive">
            <p>{props.name} amount: {props.amount} credits</p>
        </div>
    );
}