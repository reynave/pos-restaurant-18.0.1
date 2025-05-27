   UNION
         -- SC
          SELECT c.id, c.modifierId,   
        CASE
          WHEN c.taxStatus = 1 THEN (i.price * (c.scRate /100))
          WHEN c.taxStatus = 2 THEN i.price - ( i.price / (1+(c.taxRate /100)) )
          ELSE 0
        END
        AS 'price',  
         m.scNote AS 'descl',
        c.cartItemId, 0 as 'checkBox'
              FROM cart_item_modifier AS c 
              LEFT JOIN menu_tax_sc AS m ON m.id = c.menuTaxScId  
              LEFT JOIN cart_item AS i ON i.id =c.cartItemId
              where c.cartItemId = ${row.id}
        and c.presence = 1 and c.void = 0  and c.taxStatus != 0 


        UNION
         -- TAX
          SELECT c.id, c.modifierId,   
        CASE
          WHEN c.taxStatus = 1 THEN (i.price + (i.price * (c.scRate /100))) * (c.taxRate /100)
          WHEN c.taxStatus = 2 THEN i.price - ( i.price / (1+(c.taxRate /100)) )
          ELSE 0
        END
        AS 'price',  
        m.taxNote AS 'descl',
        c.cartItemId, 0 as 'checkBox'
              FROM cart_item_modifier AS c 
              LEFT JOIN menu_tax_sc AS m ON m.id = c.menuTaxScId  
              LEFT JOIN cart_item AS i ON i.id =c.cartItemId
              where c.cartItemId = ${row.id}
        and c.presence = 1 and c.void = 0  and c.taxStatus != 0 