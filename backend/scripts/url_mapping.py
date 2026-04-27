"""
Mapping des URLs de fiches produits par marque pour scraper les images.
Teste chaque URL et si elle répond 200, tente d'extraire og:image.
"""

URL_MAPPING = [
    # ── Robots aspirateurs ──
    # Roborock (✅ OK)
    ("roborock", lambda s: f"https://us.roborock.com/products/roborock-{s.replace('qrevo-curv','qrevo-curv').replace('saros-10','saros-10').replace('q8-max','q8-max').replace('q5-pro','q5-pro')}"),
    
    # iRobot Roomba
    ("irobot", lambda s: f"https://www.irobot.fr/{s.replace('roomba-combo-j9','roomba-combo-j9-plus').replace('roomba-205-dustcompactor-combo','roomba-combo-205')}"),
    ("irobot", lambda s: "https://www.irobot.fr/roomba"),

    # Dreame
    ("dreame", lambda s: f"https://www.dreame.com/en/product/{s.replace('l50-ultra','L50-Ultra').replace('matrix10-ultra','Matrix10-Ultra')}"),
    ("dreame", lambda s: f"https://www.dreame.com/fr/search?q={s.replace('-','+')}"),
    
    # Eufy
    ("eufy", lambda s: f"https://www.eufy.com/products/{s.replace('x10-pro-omni','t8860').replace('eufy-','')}"),
    
    # Lefant
    ("lefant", lambda s: f"https://www.lefant.com/products/m210-pro"),
    
    # MOVA
    ("mova", lambda s: f"https://www.movarobot.com/product/p10-pro-ultra"),
    
    # Xiaomi
    ("xiaomi", lambda s: f"https://www.mi.com/fr/product/{s.replace('robot-vacuum-s20','roborock-s20')}"),
    ("xiaomi", lambda s: "https://www.mi.com/fr/search?q=robot+vacuum+S20"),
    
    # Yeedi
    ("yeedi", lambda s: f"https://www.yeedi.com/product/{s.replace('m14','m14-pro')}"),

    # TP-Link Tapo
    ("tapo", lambda s: f"https://www.tapo.com/fr/product/{s.replace('rv30-max-plus','RV30-Max-Plus')}"),
    
    # Samsung Bespoke
    ("samsung", lambda s: f"https://www.samsung.com/fr/support/model/{s.replace('bespoke-jet-bot-combo-ai','BESPOKE-Jet-Bot-Combo-AI')}/"),
    ("samsung", lambda s: "https://www.samsung.com/fr/vacuum-cleaners/robot-vacuum/"),

    # Matic
    ("matic", lambda s: "https://www.matic.com"),

    # ── TV OLED ──
    # Samsung TV
    ("samsung", lambda s: f"https://www.samsung.com/fr/tvs/oled-tv/{s.replace('tv-oled-samsung-s85f-2025','s85f').replace('tv-oled-samsung-s90f-2025','s90f')}/"),
    ("samsung", lambda s: f"https://www.samsung.com/fr/tvs/oled-tv/"),
    
    # LG TV
    ("lg", lambda s: f"https://www.lg.com/fr/tv/lg-{s.replace('tv-oled-lg-','').replace('-2024','').replace('-2025','')}/"),
    ("lg", lambda s: f"https://www.lg.com/fr/tv-soundbars/televisions/"),
    
    # Philips TV
    ("philips", lambda s: f"https://www.philips.fr/c-p/{s.replace('tv-oled-philips-oled909-2024','OLED909')}/tv-oled"),
    ("philips", lambda s: f"https://www.philips.fr/c-p/{s.replace('tv-oled-philips-oled959-2024','OLED959')}/tv-oled"),
    ("philips", lambda s: "https://www.philips.fr/c-tv/televisions"),
    
    # Hisense
    ("hisense", lambda s: f"https://hisense.fr/products/{s.replace('tv-oled-hisense-a85n-2024','a85n-2024')}"),
    ("hisense", lambda s: "https://hisense.fr/collections/televiseurs"),

    # ── Micro-ondes ──
    # Samsung micro
    ("samsung", lambda s: f"https://www.samsung.com/fr/microwave-ovens/{s.replace('samsung-ms23k3515ak','ms23k3515ak').replace('samsung-mc32db7746k','mc32db7746k')}/"),
    ("samsung", lambda s: "https://www.samsung.com/fr/microwave-ovens/all-microwave-ovens/"),
    
    # LG micro
    ("lg", lambda s: f"https://www.lg.com/fr/microwave-ovens/lg-{s.replace('lg-neochef-ms2535gib','MS2535GIB').replace('lg-mh7265dps','MH7265DPS')}/"),
    ("lg", lambda s: "https://www.lg.com/fr/microwave-ovens/"),
    
    # Whirlpool micro
    ("whirlpool", lambda s: f"https://www.whirlpool.fr/{s.replace('whirlpool-w7-mw461','micro-ondes/w7-mw461').replace('whirlpool-mwp338sx','micro-ondes/mwp338sx')}.html"),
    ("whirlpool", lambda s: "https://www.whirlpool.fr/micro-ondes/"),
    
    # Panasonic micro
    ("panasonic", lambda s: f"https://www.panasonic.com/fr/consumer/kitchen/microwave-ovens/{s.replace('panasonic-nn-cd87k','nn-cd87k')}.html"),
    ("panasonic", lambda s: "https://www.panasonic.com/fr/consumer/kitchen/microwave-ovens.html"),
    
    # Siemens micro
    ("siemens", lambda s: f"https://www.siemens-home.bsh-group.com/fr/thermal-appliances/microwaves/{s.replace('siemens-iq700-bf634lgs1','BF634LGS1')}"),
    ("siemens", lambda s: "https://www.siemens-home.bsh-group.com/fr/thermal-appliances/microwaves"),
    
    # Miele micro
    ("miele", lambda s: f"https://www.miele.fr/p/{s.replace('miele-m7240-tc','M-7240-TC')}"),
    ("miele", lambda s: "https://www.miele.fr/micro-ondes-1611.htm"),

    # ── Lave-vaisselle ──
    ("whirlpool", lambda s: f"https://www.whirlpool.fr/dishwashers/{s.replace('lave-vaisselle-whirlpool-wfo3t141pf','WFO-3T141-PF-X')}.html"),
    ("whirlpool", lambda s: "https://www.whirlpool.fr/lave-vaisselle/"),
    ("haier", lambda s: f"https://www.haier.com/fr/dishwashers/{s.replace('lave-vaisselle-haier-xs6b2s3psb','XS6B2S3PSB')}"),
    ("candy", lambda s: f"https://www.candy-home.com/fr-FR/{s.replace('lave-vaisselle-candy-cdw1l952dw','CDW1L952DW')}"),
    ("de dietrich", lambda s: f"https://www.dedietrich.com/fr/produits/lave-vaisselle/{s.replace('lave-vaisselle-de-dietrich-dvh1524jx','DVH1524JX')}"),

    # ── Frigos ──
    ("haier", lambda s: f"https://www.haier.com/fr/refrigerators/{s.replace('combo-haier-htr3619fnmi','HTR3619FNMI')}"),
    ("whirlpool", lambda s: f"https://www.whirlpool.fr/refrigerators/{s.replace('combo-whirlpool-wnf9-t3bx','WNF-9-T3B-X')}.html"),
    ("beko", lambda s: f"https://www.beko.com/fr-fr/{s.replace('combo-beko-rcne560e40zwn-70-cm','RCNE560E40ZWN')}"),
    ("aeg", lambda s: f"https://www.aeg.fr/{s.replace('combo-aeg-rcb736e5mx','RCB736E5MX')}"),
    ("samsung", lambda s: f"https://www.samsung.com/fr/refrigerators/{s.replace('combo-samsung-rb38c7b5a12','RB38C7B5A12')}/"),
    ("samsung", lambda s: "https://www.samsung.com/fr/refrigerators/all-refrigerators/"),
    ("lg", lambda s: f"https://www.lg.com/fr/refrigerators/lg-{s.replace('combo-lg-gbp62pznac','GBP62PZNAC')}/"),
    ("lg", lambda s: "https://www.lg.com/fr/refrigerators/"),

    # ── Barre de son ──
    ("samsung", lambda s: f"https://www.samsung.com/fr/soundbars/{s.replace('barre-son-samsung-hw-q600c','HW-Q600C')}/"),
    ("samsung", lambda s: "https://www.samsung.com/fr/soundbars/all-soundbars/"),

    # ── Ordinateurs ──
    ("dell", lambda s: f"https://www.dell.com/fr-fr/shop/{s.replace('dell-inspiron-15-3000','inspiron-15-3525-laptop')}"),
    ("dell", lambda s: "https://www.dell.com/fr-fr/shop/dell-laptops/inspiron-laptops"),
    ("lenovo", lambda s: f"https://www.lenovo.com/fr/fr/p/laptops/thinkpad/{s.replace('lenovo-thinkpad-e14-gen5','thinkpad-e14-gen-5-amd')}"),
    ("lenovo", lambda s: f"https://www.lenovo.com/fr/fr/p/laptops/yoga/{s.replace('lenovo-yoga7-2in1','yoga-7-2-in-1-gen-9-14-amd')}"),
    ("lenovo", lambda s: "https://www.lenovo.com/fr/fr/laptops/"),
    ("asus", lambda s: f"https://www.asus.com/fr/laptops/for-home/zenbook/{s.replace('asus-zenbook14x-oled','zenbook-14x-oled-ux3404')}/"),
    ("asus", lambda s: "https://www.asus.com/fr/laptops/for-home/zenbook/"),
    ("apple", lambda s: "https://www.apple.com/fr/macbook-air/"),
    ("apple", lambda s: "https://www.apple.com/fr/macbook-pro/"),
]
