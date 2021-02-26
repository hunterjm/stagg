import { ReactNode } from 'react'
import { TemplateProps } from 'src/components/Template'

export interface ReportTemplateProps extends Partial<TemplateProps> {
    children: ReactNode
}
export const ReportTemplate = ({ children }:ReportTemplateProps) => {
    return (
      <>
        <main>
          { children }
        </main>
        <footer>
          <p>WARZONE.AI</p>
        </footer>
      </>
    )
}
