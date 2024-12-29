import { Budget } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useCustomers } from "@/contexts/CustomersContext";
import { mockSettings } from "@/mocks/settings";
import { useVehicles } from "@/contexts/VehiclesContext";

interface BudgetPDFTemplateProps {
  budget: Budget;
}

export function BudgetPDFTemplate({ budget }: BudgetPDFTemplateProps) {
  const { customers } = useCustomers();
  const { vehicles } = useVehicles();
  const customer = customers.find((c) => c.id === budget.customerId);
  const settings = mockSettings;

  return (
    <div style={{
      padding: '32px',
      background: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      width: '210mm',
      minHeight: '297mm',
      color: '#000'
    }}>
      {/* Cabeçalho */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '32px',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '16px'
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px'
          }}>Orçamento #{budget.id}</h1>
          <p style={{ color: '#6b7280', marginBottom: '4px' }}>Data: {formatDate(budget.createdAt)}</p>
          <p style={{ color: '#6b7280' }}>Status: {
            budget.status === 'approved' ? 'Aprovado' :
            budget.status === 'pending' ? 'Pendente' :
            budget.status === 'rejected' ? 'Rejeitado' : 'Rascunho'
          }</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#111827'
          }}>{settings.name}</h2>
          <p style={{ color: '#6b7280' }}>CNPJ: {settings.document}</p>
        </div>
      </div>

      {/* Dados do Cliente */}
      <div style={{
        marginBottom: '32px',
        backgroundColor: '#f9fafb',
        padding: '16px',
        borderRadius: '8px'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '12px'
        }}>Dados do Cliente</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px'
        }}>
          <div>
            <p style={{ color: '#6b7280', marginBottom: '4px' }}>Nome:</p>
            <p style={{ fontWeight: '500' }}>{customer?.name || "Cliente não encontrado"}</p>
          </div>
          <div>
            <p style={{ color: '#6b7280', marginBottom: '4px' }}>Email:</p>
            <p style={{ fontWeight: '500' }}>{customer?.email || "N/A"}</p>
          </div>
          <div>
            <p style={{ color: '#6b7280', marginBottom: '4px' }}>Telefone:</p>
            <p style={{ fontWeight: '500' }}>{customer?.phone || "N/A"}</p>
          </div>
          {customer?.document && (
            <div>
              <p style={{ color: '#6b7280', marginBottom: '4px' }}>Documento:</p>
              <p style={{ fontWeight: '500' }}>{customer.document}</p>
            </div>
          )}
        </div>
      </div>

      {/* Veículos */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '16px'
        }}>Veículos</h2>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '16px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                borderBottom: '1px solid #e5e7eb',
                color: '#374151',
                fontWeight: '600'
              }}>Veículo</th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                borderBottom: '1px solid #e5e7eb',
                color: '#374151',
                fontWeight: '600'
              }}>Período</th>
              <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                borderBottom: '1px solid #e5e7eb',
                color: '#374151',
                fontWeight: '600'
              }}>Tipo</th>
              <th style={{
                textAlign: 'right',
                padding: '12px 16px',
                borderBottom: '1px solid #e5e7eb',
                color: '#374151',
                fontWeight: '600'
              }}>Diária</th>
              <th style={{
                textAlign: 'right',
                padding: '12px 16px',
                borderBottom: '1px solid #e5e7eb',
                color: '#374151',
                fontWeight: '600'
              }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {budget.vehicles.map((budgetVehicle) => {
              const vehicle = vehicles.find(v => v.id === budgetVehicle.vehicleId);
              return (
                <tr key={budgetVehicle.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <p style={{ fontWeight: '500' }}>{budgetVehicle.vehicleName}</p>
                    {vehicle?.plate && (
                      <p style={{ fontSize: '14px', color: '#6b7280' }}>
                        Placa: {vehicle.plate}
                      </p>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <p>{formatDate(budgetVehicle.startDate)}</p>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>até</p>
                    <p>{formatDate(budgetVehicle.endDate)}</p>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {budgetVehicle.serviceType === 'DAILY_10H' ? 'Diária 10h' :
                     budgetVehicle.serviceType === 'DAILY_12H' ? 'Diária 12h' : 'Transfer'}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    {formatCurrency(budgetVehicle.dailyRate)}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '500' }}>
                    {formatCurrency(budgetVehicle.totalAmount)}
                  </td>
                </tr>
              );
            })}
            <tr style={{ backgroundColor: '#f9fafb', fontWeight: 'bold' }}>
              <td colSpan={4} style={{ padding: '16px', textAlign: 'right' }}>
                Valor Total:
              </td>
              <td style={{ padding: '16px', textAlign: 'right' }}>
                {formatCurrency(budget.totalAmount)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Observações e Termos */}
      <div style={{
        marginBottom: '32px',
        fontSize: '14px',
        color: '#6b7280'
      }}>
        <p style={{ marginBottom: '4px' }}>* Os valores apresentados são válidos por 7 dias.</p>
        <p style={{ marginBottom: '4px' }}>* O pagamento deve ser realizado conforme as condições acordadas.</p>
        <p style={{ marginBottom: '4px' }}>* As diárias incluem seguro conforme especificado em contrato.</p>
      </div>

      {/* Rodapé com Dados da Empresa */}
      <div style={{
        borderTop: '1px solid #e5e7eb',
        paddingTop: '16px',
        marginTop: 'auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <div>
            <p style={{ marginBottom: '4px' }}>{settings.name}</p>
            <p style={{ marginBottom: '4px' }}>CNPJ: {settings.document}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ marginBottom: '4px' }}>Email: {settings.email}</p>
            <p style={{ marginBottom: '4px' }}>Telefone: {settings.phone}</p>
            <p style={{ marginBottom: '4px' }}>{settings.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
