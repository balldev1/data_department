'use client';
// pages/index.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

type TransformedData = {
    [department: string]: {
        male: number;
        female: number;
        ageRange: string;
        hair: { [color: string]: number };
        addressUser: { [fullName: string]: string };
    };
};

export default function TodoList() {
    const [data, setData] = useState<TransformedData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/users');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    if (!data) return <p>Loading...</p>;

    return (
        <div>
            <h1>Department Data</h1>
            {Object.keys(data).map((department) => (
                <div key={department}>
                    <div className="flex bg-rose-500">
                        department <h2 className="ml-2">{department}</h2>
                    </div>
                    <p>Male: {data[department].male}</p>
                    <p>Female: {data[department].female}</p>
                    <p>Age Range: {data[department].ageRange}</p>
                    <h3>Hair Colors</h3>
                    <ul>
                        {Object.entries(data[department].hair).map(([color, count]) => (
                            <li key={color}>
                                {color}: {count}
                            </li>
                        ))}
                    </ul>
                    <h3>Address Users</h3>
                    <ul>
                        {Object.entries(data[department].addressUser).map(([name, postalCode]) => (
                            <li key={name}>
                                {name}: {postalCode}
                            </li>
                        ))}
                    </ul>
                    ---------------------
                </div>
            ))}
        </div>
    );
}
