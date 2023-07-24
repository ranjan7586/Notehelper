class ApiFeature {
    constructor(query, queryString) {
        // console.log("keyword");
        this.query = query;
        this.queryString = queryString;
    }
    search() {
        const keyword = this.queryString.keyword ? {
            name: {
                $regex: this.queryString.keyword,
                $options: "i",
            }
        } : {};
        console.log(this.queryString);
        // console.log(this.query);
        this.query = this.query.find({ ...keyword });
        return this;
    }
    //filter
    filter() {
        const queryCopy = { ...this.queryString };
        console.log(queryCopy)
        // console.log(this.queryString)
        //removing some fields
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key]);
        console.log(queryCopy);
        this.query = this.query.find(queryCopy);

        return this;
    }

    //pagination
    pagination(resultPerPage) {
        const currentPage = Number(this.queryString.page || 1);
        const skip = resultPerPage * (currentPage - 1);
        this.query=this.query.limit(resultPerPage).skip(skip);
        return this;
    }

}
module.exports = ApiFeature;
