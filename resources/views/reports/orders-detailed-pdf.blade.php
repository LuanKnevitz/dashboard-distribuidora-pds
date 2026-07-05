<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Pedidos Detalhados - StockDrink</title>
    <style>
        @page {
            margin: 24px;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #222;
            margin: 0;
        }

        h1, h2, h3 {
            margin: 0 0 8px 0;
        }

        .muted {
            color: #666;
            margin: 2px 0;
        }

        .section {
            margin-top: 24px;
        }

        .order-block {
            margin-top: 20px;
            border: 1px solid #ddd;
            padding: 14px;
            page-break-inside: avoid;
        }

        .info-table,
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        .info-table td,
        .items-table th,
        .items-table td {
            border: 1px solid #ddd;
            padding: 8px;
            vertical-align: top;
        }

        .items-table th {
            background: #f3f4f6;
            text-align: left;
        }

        .label {
            font-weight: bold;
        }

        thead {
            display: table-header-group;
        }

        tr, td, th {
            page-break-inside: avoid;
        }
    </style>
</head>
<body>
    <h1>Relatório Detalhado de Pedidos</h1>
    <p class="muted">Período: {{ $filters['period_label'] }}</p>
    <p class="muted">Gerado em: {{ $generatedAt->format('d/m/Y H:i') }}</p>

    <div class="section">
        @forelse($orders as $order)
            <div class="order-block">
                <h2>{{ $order->order_number ?? ('#' . $order->id) }}</h2>

                <table class="info-table">
                    <tr>
                        <td>
                            <span class="label">Data</span><br>
                            {{ \Carbon\Carbon::parse($order->created_at)->format('d/m/Y H:i') }}
                        </td>
                        <td>
                            <span class="label">Cliente</span><br>
                            {{ $order->customer_name }}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="label">Status</span><br>
                            @if($order->status === 'pending')
                                Pendente
                            @elseif($order->status === 'confirmed')
                                Confirmado
                            @elseif($order->status === 'separated')
                                Separado
                            @elseif($order->status === 'delivered')
                                Entregue
                            @elseif($order->status === 'cancelled')
                                Cancelado
                            @else
                                {{ $order->status }}
                            @endif
                        </td>
                        <td>
                            <span class="label">Forma de pagamento</span><br>
                            {{ $order->payment_method ?? '-' }}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <span class="label">Total do pedido</span><br>
                            R$ {{ number_format($order->total, 2, ',', '.') }}
                        </td>
                    </tr>
                </table>

                <h3 style="margin-top: 14px;">Itens do pedido</h3>

                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Tipo de venda</th>
                            <th>Quantidade</th>
                            <th>Preço</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($order->items as $item)
                            <tr>
                                <td>{{ $item->product?->name ?? '-' }}</td>
                                <td>
                                    @if($item->sale_type === 'bundle')
                                        Fardo
                                    @elseif($item->sale_type === 'unit')
                                        Unidade
                                    @else
                                        {{ $item->sale_type }}
                                    @endif
                                </td>
                                <td>{{ $item->quantity }}</td>
                                <td>R$ {{ number_format($item->item_price, 2, ',', '.') }}</td>
                                <td>R$ {{ number_format($item->subtotal, 2, ',', '.') }}</td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5">Nenhum item encontrado para este pedido.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        @empty
            <p>Nenhum pedido encontrado para o período selecionado.</p>
        @endforelse
    </div>
</body>
</html>