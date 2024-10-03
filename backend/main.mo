import Text "mo:base/Text";

actor {
  stable var lastTranslation : Text = "";

  public func setLastTranslation(translation : Text) : async () {
    lastTranslation := translation;
  };

  public query func getLastTranslation() : async Text {
    lastTranslation
  };
}
