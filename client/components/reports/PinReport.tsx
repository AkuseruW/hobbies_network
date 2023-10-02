'use client'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Icons } from '../icons'
import { pin_unpin_report } from '@/utils/requests/_reports_requests'

const PinReport = ({ id, is_pinned }: { id: number, is_pinned: boolean }) => {
    const [isPinned, setIsPinned] = useState(is_pinned);

    const onClick = async () => {
        await pin_unpin_report({ report_id: id });
        setIsPinned(!isPinned);
    }

    return (
        <Button type='button'
            onClick={onClick}
            variant="outline"
        >
            {isPinned ? <Icons.unpin /> : <Icons.pin />}
        </Button>
    )
}

export default PinReport
