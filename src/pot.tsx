import * as React from 'react';

export interface PotProps {
    name: string,
    amount: number
}

export default function Pot(props: PotProps) {
    return (
        <div className="rounded p-1 shadow-inactive">
            <p>{props.name} amount: {props.amount} credits</p>
        </div>
    );
}