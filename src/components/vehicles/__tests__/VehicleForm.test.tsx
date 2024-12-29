import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VehicleForm } from '../VehicleForm';
import { ToastProvider } from '@/components/ui/toast';
import '@testing-library/jest-dom';

// Mock do hook de toast
const mockToast = jest.fn();
jest.mock('@/components/ui/toast', () => ({
  ...jest.requireActual('@/components/ui/toast'),
  useToast: () => ({ toast: mockToast })
}));

describe('VehicleForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o formulário corretamente', () => {
    const { getByLabelText } = render(
      <ToastProvider>
        <VehicleForm {...defaultProps} />
      </ToastProvider>
    );

    expect(getByLabelText(/Marca/i)).toBeInTheDocument();
    expect(getByLabelText(/Modelo/i)).toBeInTheDocument();
    expect(getByLabelText(/Placa/i)).toBeInTheDocument();
  });

  it('submete o formulário com dados válidos', async () => {
    const { getByLabelText, getByText } = render(
      <ToastProvider>
        <VehicleForm {...defaultProps} />
      </ToastProvider>
    );

    const user = userEvent.setup();

    // Preenche os campos obrigatórios
    await user.type(getByLabelText(/Marca/i), 'Toyota');
    await user.type(getByLabelText(/Modelo/i), 'Corolla');
    await user.type(getByLabelText(/Placa/i), 'ABC1234');
    await user.type(getByLabelText(/Ano/i), '2022');

    // Submete o formulário
    await user.click(getByText(/Salvar/i));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Sucesso',
        description: 'Veículo salvo com sucesso!'
      }));
    });
  });

  it('mostra erros de validação', async () => {
    const { getByText } = render(
      <ToastProvider>
        <VehicleForm {...defaultProps} />
      </ToastProvider>
    );

    const user = userEvent.setup();

    // Tenta submeter sem preencher campos
    await user.click(getByText(/Salvar/i));

    await waitFor(() => {
      expect(getByText(/Marca é obrigatório/i)).toBeInTheDocument();
      expect(getByText(/Modelo é obrigatório/i)).toBeInTheDocument();
      expect(getByText(/Placa é obrigatória/i)).toBeInTheDocument();
    });
  });
});
