import json
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from products.models import Product

class Command(BaseCommand):
    help = 'Load products from JSON file into MongoDB'

    def handle(self, *args, **kwargs):
        json_file_path = os.path.join(settings.BASE_DIR, 'products', 'products.json')

        if not os.path.exists(json_file_path):
            self.stdout.write(self.style.ERROR(f'File not found: {json_file_path}'))
            return

        with open(json_file_path, 'r', encoding='utf-8') as f:
            products = json.load(f)

        for p in products:
            # Strip whitespace from name to avoid hidden chars
            name = p['name'].strip()

            product_obj = Product.objects(name=name).first()
            if product_obj:
                # Update existing
                product_obj.price = float(p['price'])
                product_obj.category = p['category'].strip()
                product_obj.image = p.get('image', '').strip()
                product_obj.stock = int(p.get('stock', 0))
                product_obj.description = p.get('description', '').strip()
                product_obj.features = p.get('features', [])
                product_obj.save()
            else:
                # Create new
                Product(
                    name=name,
                    price=float(p['price']),
                    category=p['category'].strip(),
                    image=p.get('image', '').strip(),
                    stock=int(p.get('stock', 0)),
                    description=p.get('description', '').strip(),
                    features=p.get('features', [])
                ).save()

        self.stdout.write(self.style.SUCCESS(f'{len(products)} product(s) loaded successfully!'))
