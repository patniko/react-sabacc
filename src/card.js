import React from 'react';

export default function Card(props) {
    return (
        <img src={props.card.img} onClick={props.onClick} />
    );
}