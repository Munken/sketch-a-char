class User < ActiveRecord::Base
  has_many :authorizations, dependent: :destroy
  validates_presence_of :name
  attr_accessible :name
  extend FriendlyId
  friendly_id :name, :use => :slugged
  acts_as_voter
  has_karma :samples, as: :submitter

  def self.create_from_hash!(hash)
    create!(:name => hash['info']['name'])
  end

  def identity?
    authorizations.any?
  end

  def admin?
    superuser? # TODO allow based on karma!
  end

  def update_karma_cache!
    self.karma_cache = self.karma
    save! validate: false
  end

  scope :top, order('users.karma_cache DESC')
end
