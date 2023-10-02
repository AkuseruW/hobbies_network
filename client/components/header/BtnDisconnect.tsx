import React from 'react'
import { Button } from '@/components/ui/button'
import { PowerIcon } from "@heroicons/react/24/solid";


const BtnDisconnect = () => {
    return (
        <Button variant="outline" size="icon">
            <PowerIcon className="w-6 h-6 text text-accent-color" />
        </Button>
    )
}

export default BtnDisconnect
