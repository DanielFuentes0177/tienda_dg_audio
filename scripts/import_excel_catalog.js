const fs = require('fs');
const readXlsxFile = require('read-excel-file/node');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const filePath = 'catalogo/Catalogo_Tienda_DG_Audiosound_WEB.xlsx';

  console.log('Leyendo archivo Excel...');
  const sheets = await readXlsxFile(filePath); // [{ sheet, data: [[fila], ...] }]
  const rows = sheets[0].data;
  const headers = rows[0].map((h) => String(h ?? '').trim());
  // Cada fila -> objeto { Encabezado: valor }
  const data = rows.slice(1).map((r) => {
    const obj = {};
    headers.forEach((h, i) => { if (h && r[i] != null && String(r[i]).trim() !== '') obj[h] = typeof r[i] === 'string' ? r[i].trim() : r[i]; });
    return obj;
  }).filter((o) => Object.keys(o).length);

  console.log(`Leídas ${data.length} filas del Excel.`);

  const mappedProducts = data.map(row => {
    // Si Publicar no es 'Sí' o similar, podríamos filtrarlos, pero por ahora los metemos todos, tal vez isActive false
    const isActive = row['Publicar'] === 'Sí' || row['Publicar'] === 'Si' || row['Publicar'] === 'SI';
    
    // Convertir stock / disponibilidad si es necesario, pero como es sin precio/stock real, pondremos 0
    // Podemos guardar la cadena de disponibilidad en la descripción o dejarla.
    const disponibilidadStr = row['Disponibilidad'] ? `\n\nDisponibilidad: ${row['Disponibilidad']}` : '';
    
    return {
      name: row['Nombre_Producto'] || "Sin Nombre",
      description: (row['Descripcion_Comercial'] || "") + disponibilidadStr,
      stock: 0,
      category: row['Categoria'] || null,
      brand: row['Marca'] || null,
      family: row['Segmento'] || null,
      subcategory: row['Subcategoria'] || null,
      model: row['Modelo'] || null,
      color: row['Color_Acabado'] || null,
      warranty: row['Garantia'] || null,
      shipping: row['Tipo_Envio'] || null,
      storeClassification: row['Clasificacion_Tienda'] || null,
      isActive: isActive,
      images: [], // Placeholder for future multi-image support
    };
  });

  console.log('Borrando productos existentes...');
  await prisma.product.deleteMany({});
  
  console.log('Insertando nuevos productos...');
  // Prisma createMany puede fallar si mandamos miles, pero si son pocos miles no hay problema
  const result = await prisma.product.createMany({
    data: mappedProducts
  });

  console.log(`¡Insertados ${result.count} productos exitosamente!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
