/**
 * SERVICE_SUBCATEGORY_META
 * Hero banner metadata for each service subcategory landing page.
 * Keys correspond to subcategory keys in SERVICES_CATALOG.
 */

const SERVICE_SUBCATEGORY_META = {
    // FITOK
    valves: {
        image: 'assets/img/services/FITOK_valves.png',
        description: 'Explore our full range of FITOK valves — from ball and needle valves to high-pressure and multiport configurations. Authorized distributor stocking quality parts for every critical application.',
    },
    pressure_regulators: {
        image: 'assets/img/services/pressure_regulators.png',
        description: 'Single-stage and two-stage regulators to dome-loaded back pressure regulators. We provide precision pressure control for laboratory gas systems and industrial processes.',
    },
    fittings_tubing: {
        image: 'assets/img/services/FITOK_valves.png',
        description: 'Stainless steel 316L compression fittings, compatible with Parker and Swagelok standards. Complete tubing solutions including benders, cutters, and adapters.',
    },
    sampling_accessories: {
        image: 'assets/img/services/Gemini_Generated_Image_o2y6jgo2y6jgo2y6.png',
        description: 'Cylinder valves, inline filters, pressure gauges, and manifold blocks for rigorous gas sampling applications. CGA / DIN standard compatible.',
    },

    // Gas Generators
    nitrogen_generators: {
        image: 'assets/img/services/nitrogen generator.png',
        description: 'On-site nitrogen generation ensures continuous, ultra-pure N₂ supply for GC, LC-MS, and evaporation systems — eliminating dependence on cylinders.',
    },
    hydrogen_generators: {
        image: 'assets/img/services/nitrogen generator.png',
        description: 'PEM electrolysis hydrogen generators delivering dry, high-purity H₂ for FID detectors and GC carrier gas applications — safe, compact, and reliable.',
    },
    zero_air_generators: {
        image: 'assets/img/services/gas_distribution_system.png',
        description: 'Hydrocarbon-free zero air for GC-FID baseline calibration and combustion applications. Packaged lab air systems with integrated compressor and dryer.',
    },
    gas_generator_lcms: {
        image: 'assets/img/services/nitrogen generator.png',
        description: 'Dedicated LC-MS gas generation using membrane technology. The S-Series provides combined nitrogen and air for complete mass spectrometry gas supply.',
    },

    // Sampling Systems
    closed_loop_systems: {
        image: 'assets/img/services/Gemini_Generated_Image_o2y6jgo2y6jgo2y6.png',
        description: 'Closed loop sampling eliminates operator exposure to hazardous process fluids. Zero-emission panels and fast-loop systems for continuous process monitoring.',
    },
    gas_sampling_bombs: {
        image: 'assets/img/services/Gemini_Generated_Image_o2y6jgo2y6jgo2y6.png',
        description: 'Floating piston and fixed-volume gas sampling cylinders from 300cc to 3000cc. Portable sampling kits for field and lab use. Calibration gas transfer accessories.',
    },
    sample_conditioning: {
        image: 'assets/img/services/Gemini_Generated_Image_o2y6jgo2y6jgo2y6.png',
        description: 'Complete sample conditioning panels for moisture analysis, humidity sensing, and GC interface. Multi-stream selectors for automated sampling networks.',
    },

    // Analytical Instruments
    hplc_column_ovens: {
        image: 'assets/img/services/Gemini_Generated_Image_tv0tdhtv0tdhtv0t.png',
        description: 'Precise thermostatting of HPLC columns improves peak resolution and reproducibility. Cooler/heater combos and multi-port column selectors available.',
    },
    flow_meters: {
        image: 'assets/img/services/Gemini_Generated_Image_tv0tdhtv0tdhtv0t.png',
        description: 'Mass flow controllers and variable area rotameters for gas and liquid applications. Digital meters with optional SCADA/4–20mA output.',
    },
    vacuum_pumps: {
        image: 'assets/img/services/Gemini_Generated_Image_tv0tdhtv0tdhtv0t.png',
        description: 'Oil-sealed and dry vacuum pumps for laboratory and industrial process applications. Turbo molecular and gauge sensors for high-vacuum systems.',
    },
    detectors_sensors: {
        image: 'assets/img/services/Gemini_Generated_Image_tv0tdhtv0tdhtv0t.png',
        description: 'Replacement and upgrade detectors for gas chromatography systems. TCD, FID, UV/Vis, and PID detectors with broad compatibility.',
    },

    // Industrial Projects
    gas_distribution: {
        image: 'assets/img/services/gas_distribution_system.png',
        description: 'End-to-end design and installation of central lab gas distribution systems. Automatic changeover panels, point-of-use outlets, and low-gas alarm integration.',
    },
    piping_utilities: {
        image: 'assets/img/services/gas_distribution_system.png',
        description: 'Sealed stainless steel gas piping routed through floors and ceilings. Pressure reducing stations and compression tubing networks with full leak-testing.',
    },
    custom_skids: {
        image: 'assets/img/services/gas_distribution_system.png',
        description: 'Engineered-to-order process skids for gas filtration, pressure testing, and custom process control. Full documentation and CE marking available.',
    },
    gas_detection: {
        image: 'assets/img/services/gas_distribution_system.png',
        description: 'Fixed and portable gas detection for LEL, toxic gas, and multi-gas hazards. PLC and relay-based alarm panels with automated shutdown integration.',
    },

    // Lab Accessories
    ultrasonic_baths: {
        image: 'assets/img/services/baths.png',
        description: 'Benchtop and industrial ultrasonic cleaning baths with heating, timer, and degas functions. Ideal for glassware cleaning, extraction, and sample dispersion.',
    },
    probe_sonicators: {
        image: 'assets/img/services/baths.png',
        description: 'High-intensity probe sonicators for cell disruption, emulsification, and nanoparticle homogenization. Multiple tip sizes and cup horn accessories available.',
    },
    positive_pressure: {
        image: 'assets/img/services/baths.png',
        description: 'Positive pressure processors and SPE manifolds for rapid, consistent solid-phase extraction. Nitrogen blow-down evaporators for sample concentration.',
    },

    // Default fallback
    default: {
        image: 'assets/img/services/gas_distribution_system.png',
        description: 'Hawksbill Technik delivers premium instrumentation and engineering solutions for industrial and laboratory environments. Contact us to discuss your requirements.',
    },
};

export default SERVICE_SUBCATEGORY_META;
