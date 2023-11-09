import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const DashboardCard = ({ title, icon, value }: { title: string, icon: JSX.Element, value: number }) => {



    return (
        <Card className='dark:bg-secondary_dark dark:border-gray-400'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold text-muted-foreground"> {value} </p>
            </CardContent>
        </Card>
    );
};

export default DashboardCard