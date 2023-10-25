import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const DashboardCard = ({ title, icon }: { title: string, icon: JSX.Element }) => {
    return (
        <Card className='dark:bg-secondary_dark dark:border-gray-400'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold"></div>
                <p className="text-xs text-muted-foreground"></p>
            </CardContent>
        </Card>
    );
};

export default DashboardCard