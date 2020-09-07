import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Modal } from 'src/components/elements/Modal';

describe('<Modal />', () => {
  it("should show when 'show = true' ", async () => {
    render(
      <Modal show={true} handleClose={() => undefined}>
        Content in the modal
      </Modal>
    );

    expect(screen.getByTestId('modal')).toBeTruthy();
  });
});
