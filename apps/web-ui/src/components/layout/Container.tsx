import React, { ReactNode } from 'react';

interface ContentContainerProps {
  title: String;
  children: ReactNode;
}

export const ContentContainer = ({
  title,
  children,
}: ContentContainerProps) => {
  return (
    <section className="container">
      <div
        style={{
          padding: '2rem 0',
          textAlign: 'center',
        }}
      >
        <h2>{title}</h2>
      </div>

      <div
        style={{
          backgroundColor: '#FFFFFF',
        }}
      >
        <div style={{ margin: '0 auto', padding: '2rem 0', width: '80%' }}>
          {children}
        </div>
      </div>
    </section>
  );
};
