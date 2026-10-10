// ====================================================================
// POWER QUERY (M) - NETFLIX TITLES ETL & ARRAY CLEANING
// ====================================================================

let
    Source = Csv.Document(File.Contents("data/netflix_titles.csv"), [Delimiter=",", Columns=11, Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {
        {"title", type text},
        {"type", type text},
        {"release_year", Int64.Type},
        {"age_certification", type text},
        {"runtime", Int64.Type},
        {"genres", type text},
        {"production_countries", type text},
        {"seasons", Int64.Type},
        {"imdb_id", type text},
        {"imdb_score", type number},
        {"imdb_votes", Int64.Type}
    }),
    CleanedAge = Table.ReplaceValue(Typed, "", "Unrated", Replacer.ReplaceValue, {"age_certification"}),
    AddedPrimaryGenre = Table.AddColumn(CleanedAge, "PrimaryGenre", each Text.BeforeDelimiter(Text.Select([genres], {"a".."z", "A".."Z", ","}), ","), type text)
in
    AddedPrimaryGenre
