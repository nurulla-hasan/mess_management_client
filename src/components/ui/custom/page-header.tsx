"use client"

import { Badge } from "@/components/ui/badge"
import { ReactNode } from "react"

interface PageHeaderProps {
    title: string;
    description: string;
    length?: number;
    children?: ReactNode;
}

const PageHeader = ({ title, description, length, children }: PageHeaderProps) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="grid gap-1">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold uppercase tracking-normal">{title}</h1>
                    {length && <Badge className="rounded-full">{length}</Badge>}
                </div>
                <p className="text-muted-foreground">
                    {description}
                </p>
            </div>
            {children && <div className="flex items-center gap-2">{children}</div>}
        </div>
    )
}

export default PageHeader
