/**
 * SERVICES_CATALOG
 * Data source for the Services page dynamic rendering system.
 * Structure mirrors PRODUCTS_CATALOG from products-data.js
 *
 * Each top-level key is a service category.
 * Each category may have a `subcategories` object whose keys map to arrays of item strings.
 */

const SERVICES_CATALOG = {
    fitok_instrumentation: {
        title: 'FITOK Instrumentation',
        icon: 'bi-tools',
        image: 'assets/img/services/FITOK_valves.png',
        tagline: 'Authorized Distributor – Precision Instrumentation',
        subcategories: {
            valves: [
                'Ball Valves – 2-Piece / 3-Piece Body',
                'Needle Valves – Straight / Angle / Toggle Pattern',
                'Check Valves – Inline / Poppet Style',
                'Relief Valves – Spring Loaded / Back Pressure',
                'Metering Valves – Flow Control',
                'Multiport Valves',
                'High-Pressure Valves (up to 60,000 psi)',
            ],
            pressure_regulators: [
                'Single-Stage Regulators',
                'Two-Stage Regulators',
                'High-Purity Regulators',
                'Line Regulators',
                'Back Pressure Regulators',
                'Dome / Pilot Loaded Regulators',
            ],
            fittings_tubing: [
                'Compression Tube Fittings – Stainless 316L',
                'Parker / Swagelok Compatible Fittings',
                'NPT / BSPP / BSPT Adapters',
                'Stainless Steel Tubing – 1/8" to 1" OD',
                'High-Pressure Tubing',
                'Tube Benders & Cutters',
                'Pipe Thread Sealants and Plugs',
            ],
            sampling_accessories: [
                'Cylinder Valves – CGA / DIN Standards',
                'Inline Filters – 2 μm / 7 μm / 15 μm',
                'Pressure Gauges – Bourdon / Digital',
                'Manifold Blocks – Custom Configurations',
                'Gas Sampling Vessels',
                'Vent & Purge Panels',
            ],
        },
    },

    gas_generators: {
        title: 'Gas Generators',
        icon: 'bi-lightning-charge',
        image: 'assets/img/services/nitrogen generator.png',
        tagline: 'Ultra High-Purity Gas Generation for Laboratories',
        subcategories: {
            nitrogen_generators: [
                'Nitrogen Generator for GC (99.999%)',
                'Nitrogen Generator for LC-MS / LC-MS-MS',
                'Nitrogen Generator for Nitrogen Concentrator / Turbo Evaporator',
                'PSA Nitrogen Generator – Large Volume',
                'Membrane Nitrogen Generator',
                'Dual-Tower PSA Nitrogen Generator',
            ],
            hydrogen_generators: [
                'Hydrogen Generator – PEM Electrolysis Technology',
                'Hydrogen Generator for GC (Carrier Gas)',
                'Hydrogen Generator for FID Detector',
                'Low-Flow Hydrogen Generator (≤ 100 mL/min)',
                'High-Flow Hydrogen Generator (up to 500 mL/min)',
            ],
            zero_air_generators: [
                'Zero Air Generator for GC-FID',
                'Zero Air Generator for Combustion',
                'Packaged Lab Air System – Compressor + Dryer + Filter',
            ],
            gas_generator_lcms: [
                'Gas Generator for LCMS (Membrane Technology)',
                'Gas Generator S-Series (Nitrogen + Air Combination)',
                'Nitrogen-Air Combination Generator for GC',
            ],
        },
    },

    sampling_systems: {
        title: 'Sampling Systems',
        icon: 'bi-droplet-half',
        image: 'assets/img/services/Gemini_Generated_Image_o2y6jgo2y6jgo2y6.png',
        tagline: 'Safe & Accurate Analysis of Hazardous Fluids',
        subcategories: {
            closed_loop_systems: [
                'Closed Loop Liquid Sampling Systems',
                'Closed Loop Gas Sampling Systems',
                'Zero Emission Sampling Panels',
                'Inline Sample Coolers',
                'Fast Loop Sampling Systems',
            ],
            gas_sampling_bombs: [
                'Gas Sampling Bombs / Cylinders – 300cc to 3000cc',
                'Floating Piston Cylinders',
                'Calibration Gas Mixtures & Transfer',
                'Portable Gas Sampling Kits',
            ],
            sample_conditioning: [
                'Sample Conditioning Panels',
                'Moisture Analyzers',
                'Humidity Sensors & Transmitters',
                'Gas Chromatograph Sampling Interfaces',
                'Multi-Stream Selector Systems',
            ],
        },
    },

    analytical_instruments: {
        title: 'Analytical Instruments',
        icon: 'bi-speedometer',
        image: 'assets/img/services/Gemini_Generated_Image_tv0tdhtv0tdhtv0t.png',
        tagline: 'Precision Measurement for Critical Lab Workflows',
        subcategories: {
            hplc_column_ovens: [
                'HPLC Column Ovens – Ambient +5°C to 150°C',
                'Column Heater / Cooler Combination Units',
                'Column Selector Valves – Multi-Port',
                'Guard Column Assemblies',
            ],
            flow_meters: [
                'Mass Flow Controllers (MFC) – Gas / Liquid',
                'Variable Area Rotameters',
                'Electronic Digital Flow Meters',
                'Bubble Tube Flow Meters',
            ],
            vacuum_pumps: [
                'Oil-Sealed Rotary Vane Pumps',
                'Dry Diaphragm Vacuum Pumps',
                'Turbo Molecular Pumps',
                'Vacuum Gauge Sensors – Pirani / Penning',
            ],
            detectors_sensors: [
                'Thermal Conductivity Detectors (TCD)',
                'Flame Ionization Detectors (FID)',
                'UV/Vis Detectors',
                'Photoionization Detectors (PID)',
            ],
        },
    },

    industrial_projects: {
        title: 'Industrial Projects',
        icon: 'bi-gear-wide-connected',
        image: 'assets/img/services/gas_distribution_system.png',
        tagline: 'Turnkey Engineering Solutions from Design to Commissioning',
        subcategories: {
            gas_distribution: [
                'Central Gas Distribution Systems',
                'Point-of-Use Gas Panels',
                'Gas Cabinet Design & Installation',
                'Automatic Changeover Panels – Mechanical / Electronic',
                'Gas Manifold Systems',
                'Low-Gas Alarm Systems',
            ],
            piping_utilities: [
                'Gas Routing & Utility Pipe Routing Through Floor / Ceiling',
                'Stainless Steel Gas Piping – Sealed & Leak-Tested',
                'Compression Tubing Networks',
                'Pressure Reducing Stations',
                'High-Pressure Hydraulic Piping',
            ],
            custom_skids: [
                'Custom Engineered Skids',
                'Process Control Skids',
                'Filtration & Separation Skids',
                'Pressure Testing Rigs',
            ],
            gas_detection: [
                'Gas Detection Systems – Fixed & Portable',
                'Multi-Gas Analyzers',
                'LEL / Toxic Gas Detectors',
                'Control Panels – PLC / Relay Based',
                'Alarm & Shutdown Systems',
            ],
        },
    },

    laboratory_accessories: {
        title: 'Laboratory Accessories',
        icon: 'bi-stars',
        image: 'assets/img/services/baths.png',
        tagline: 'Sample Preparation & Cleaning Solutions',
        subcategories: {
            ultrasonic_baths: [
                'Ultrasonic Cleaning Baths – Benchtop',
                'Industrial Ultrasonic Tanks',
                'Heated Ultrasonic Baths (up to 80°C)',
                'Ultrasonic Baths with Timer & Degas',
            ],
            probe_sonicators: [
                'Probe Sonicators / Liquid Processors',
                'Tip Sonicators – 1/8" to 3/4" Probe',
                'Cup Horn Sonicators',
                'Microplate / Cell Disruptors',
            ],
            positive_pressure: [
                'Positive Pressure Processors (PPP)',
                'Automated SPE Manifolds',
                'Dry Evaporator Blocks',
                'Nitrogen Blow-Down Evaporators',
            ],
        },
    },
};

export default SERVICES_CATALOG;
