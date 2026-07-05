<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Relatório StockDrink</title>
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

        h1, h2 {
            margin: 0 0 8px 0;
        }

        .muted {
            color: #666;
            margin: 2px 0;
        }

        .section {
            margin-top: 24px;
            page-break-inside: avoid;
        }

        .summary-table,
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            page-break-inside: auto;
        }

        .summary-table td,
        .data-table th,
        .data-table td {
            border: 1px solid #ddd;
            padding: 8px;
            vertical-align: top;
        }

        .data-table th {
            background: #f3f4f6;
            text-align: left;
        }

        thead {
            display: table-header-group;
        }

        tfoot {
            display: table-row-group;
        }

        tr,
        td,
        th {
            page-break-inside: avoid;
        }

        .block-title {
            margin-bottom: 6px;
        }
    </style>
</head>
<body>
    <h1>Relatório StockDrink</h1>
    <p class="muted">Período: {{ $filters['period_label'] }}</p>
    <p class="muted">Gerado em: {{ $generatedAt->format('d/m/Y H:i') }}</p>

    <div class="section">
        <h2 class="block-title">Resumo Geral</h2>
        <table class="summary-table">
            <tr>
                <td>
                    <strong>Receita Total</strong><br>
                    R$ {{ number_format($summary['revenue_total'], 2, ',', '.') }}
                </td>
                <td>
                    <strong>Ticket Médio</strong><br>
                    R$ {{ number_format($summary['ticket_average'], 2, ',', '.') }}
                </td>
            </tr>
            <tr>
                <td>
                    <strong>Itens Vendidos</strong><br>
                    {{ $summary['items_sold'] }} unidades / {{ $summary['items_sold_bundles'] }} fardos
                </td>
                <td>
                    <strong>Produtos com Estoque Baixo</strong><br>
                    {{ $summary['low_stock_count'] }}
                </td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2 class="block-title">Vendas por Categoria</h2>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Categoria</th>
                    <th>Valor vendido</th>
                </tr>
            </thead>
            <tbody>
                @forelse($salesByCategory as $item)
                    <tr>
                        <td>{{ $item->category_name }}</td>
                        <td>R$ {{ number_format($item->total_sales, 2, ',', '.') }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="2">Nenhum dado encontrado.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2 class="block-title">Top Produtos</h2>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Produto</th>
                    <th>Categoria</th>
                    <th>Estoque</th>
                    <th>Preço</th>
                    <th>Valor em estoque</th>
                </tr>
            </thead>
            <tbody>
                @forelse($topProducts as $product)
                    <tr>
                        <td>{{ $product->name }}</td>
                        <td>{{ $product->category_name }}</td>
                        <td>{{ floor($product->stock_quantity / $product->units_per_bundle) }} fardo(s)</td>
                        <td>R$ {{ number_format($product->unit_price, 2, ',', '.') }}</td>
                        <td>R$ {{ number_format($product->stock_value, 2, ',', '.') }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5">Nenhum produto encontrado.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2 class="block-title">Estoque Baixo</h2>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Produto</th>
                    <th>Estoque</th>
                    <th>Mínimo</th>
                </tr>
            </thead>
            <tbody>
                @forelse($lowStockProducts as $product)
                    <tr>
                        <td>{{ $product->name }}</td>
                        <td>{{ floor($product->stock_quantity / $product->units_per_bundle) }} fardo(s)</td>
                        <td>{{ $product->minimum_stock }} fardo(s)</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="3">Nenhum produto com estoque baixo.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2 class="block-title">Pedidos Recentes</h2>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Pedido</th>
                    <th>Cliente</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                @forelse($recentOrders as $order)
                    <tr>
                        <td>{{ $order->order_number ?? ('#' . $order->id) }}</td>
                        <td>{{ $order->customer_name }}</td>
                        <td>R$ {{ number_format($order->total, 2, ',', '.') }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="3">Nenhum pedido encontrado.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</body>
</html>