<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Lista de separação do dia</title>
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
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        .items-table th,
        .items-table td {
            border: 1px solid #ddd;
            padding: 10px;
            vertical-align: top;
        }

        .items-table th {
            background: #f3f4f6;
            text-align: left;
        }

        .qty {
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
    <h1>Lista de separação do dia</h1>
    <p class="muted">Pedidos do dia: {{ $ordersCount }}</p>
    <p class="muted">Gerado em: {{ $generatedAt->format('d/m/Y H:i') }}</p>

    <div class="section">
        <table class="items-table">
            <thead>
                <tr>
                    <th>Produto</th>
                    <th>Tipo de venda</th>
                    <th>Quantidade total</th>
                </tr>
            </thead>
            <tbody>
                @forelse($items as $item)
                    <tr>
                        <td>{{ $item->product_name }}</td>
                        <td>
                            @if($item->sale_type === 'bundle')
                                Fardo
                            @elseif($item->sale_type === 'unit')
                                Unidade
                            @else
                                {{ $item->sale_type }}
                            @endif
                        </td>
                        <td class="qty">{{ $item->total_quantity }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="3">Nenhum item encontrado para hoje.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</body>
</html>