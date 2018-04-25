import React from 'react'

export default function Pot(props) {
    return (
        <div style={{ display: 'inline-block', border: '1px solid black', padding: '10px' }}>
            <p>{props.name} amount: {props.amount} credits</p>
        </div>
    );
}