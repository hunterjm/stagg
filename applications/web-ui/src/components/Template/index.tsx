import { ReactNode } from 'react'
import { ReportTemplate } from 'src/components/Template/report'
import { InterfaceTemplate, InterfaceTemplateProps } from 'src/components/Template/interface'

export interface TemplateProps extends Partial<InterfaceTemplateProps> {
    children: ReactNode
    renderReport?: boolean
}
export const Template = (props:TemplateProps) => {
    if (props.renderReport) {
        return (
            <ReportTemplate {...props} />
        )
    }
    return (
        <InterfaceTemplate {...(props as InterfaceTemplateProps)} />
    )
}
