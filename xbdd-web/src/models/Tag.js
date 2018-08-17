const getStatusPresences = features => {
    const findStatus = status =>
        features.find(feature =>
            feature.elements.find(element =>
                element.steps.find(step => step.result.status === status)
            )
        );

    return {
        containsPassed: !!findStatus("passed"),
        containsUndefined: !!findStatus("undefined"),
        containsFailed: !!findStatus("failed"),
        containsSkipped: !!findStatus("skipped"),
    };
};

class Tag {
    constructor(data) {
        this.name = data.tag;
        this.features = data.features;
        Object.assign(this, getStatusPresences(data.features));
    }
}

export default Tag;
