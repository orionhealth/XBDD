import Tag from './Tag';

class Report {
    constructor(data) {
        this.tagList = data.map(item => new Tag(item));
    }
}

export default Report;
